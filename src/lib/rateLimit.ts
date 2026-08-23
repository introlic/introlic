export interface RateLimitConfig {
  windowMs: number;
  limit: number;
  blockDurationMs?: number; // duration to block if limit is exceeded
  escalatedBlockLimit?: number; // number of consecutive violations to trigger escalated block
  escalatedBlockDurationMs?: number; // escalated block duration
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

export interface CheckMultipleResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
  keyFailed?: string;
}

interface RateLimitRecord {
  timestamps: number[];
  blockedUntil: number;
  violationsCount: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of memoryStore.entries()) {
    if (record.blockedUntil < now && record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Evaluates rate limit for a key.
 * If commit is true, saves the timestamp / increments violation count.
 * If commit is false, just peeks if allowed.
 */
function evaluateRateLimit(
  key: string,
  config: RateLimitConfig,
  commit: boolean
): RateLimitResult {
  const now = Date.now();
  cleanupStore();

  let record = memoryStore.get(key);
  if (!record) {
    record = {
      timestamps: [],
      blockedUntil: 0,
      violationsCount: 0,
    };
    if (commit) {
      memoryStore.set(key, record);
    }
  }

  // 1. Check if currently blocked
  if (record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt: record.blockedUntil,
      retryAfter,
    };
  }

  // 2. Filter out expired timestamps
  const windowStart = now - config.windowMs;
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  // 3. Check if limit exceeded
  if (activeTimestamps.length >= config.limit) {
    if (commit) {
      record.timestamps = activeTimestamps; // update with cleaned list
      record.violationsCount += 1;

      let blockDuration = config.blockDurationMs || config.windowMs;
      // Escalated block check
      if (config.escalatedBlockLimit && record.violationsCount >= config.escalatedBlockLimit) {
        blockDuration = config.escalatedBlockDurationMs || (blockDuration * 5);
      }

      record.blockedUntil = now + blockDuration;
      memoryStore.set(key, record);
    }

    const blockDuration = config.blockDurationMs || config.windowMs;
    const finalBlockDuration = (config.escalatedBlockLimit && (record.violationsCount + (commit ? 0 : 1)) >= config.escalatedBlockLimit)
      ? (config.escalatedBlockDurationMs || (blockDuration * 5))
      : blockDuration;

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt: now + finalBlockDuration,
      retryAfter: Math.ceil(finalBlockDuration / 1000),
    };
  }

  // 4. Commit entry if requested
  if (commit) {
    record.timestamps = activeTimestamps;
    record.timestamps.push(now);

    // If request passes, slowly decrement violations if they haven't had one recently
    if (record.timestamps.length === 1) {
      record.violationsCount = Math.max(0, record.violationsCount - 1);
    }
    memoryStore.set(key, record);
  }

  const currentCount = activeTimestamps.length + (commit ? 0 : 1);
  const remaining = Math.max(0, config.limit - currentCount);
  const oldestTimestamp = activeTimestamps[0] || now;
  const resetAt = oldestTimestamp + config.windowMs;

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetAt,
    retryAfter: 0,
  };
}

/**
 * Check multiple rate limits atomically.
 * It peeks at all rate limits first, and if all are allowed, it commits all of them.
 * If any fails, it commits the failure only on the failed key to update its block state.
 */
export function checkMultipleRateLimits(
  checks: Array<{ key: string; config: RateLimitConfig }>
): CheckMultipleResult {
  // First, peek all checks
  for (const check of checks) {
    const res = evaluateRateLimit(check.key, check.config, false);
    if (!res.allowed) {
      // Commit the failure to trigger blocking and escalate violation count on the failed key
      evaluateRateLimit(check.key, check.config, true);
      return {
        allowed: false,
        limit: check.config.limit,
        remaining: 0,
        resetAt: res.resetAt,
        retryAfter: res.retryAfter,
        keyFailed: check.key,
      };
    }
  }

  // All checks passed, commit all of them
  let minRemaining = Infinity;
  let maxResetAt = 0;

  for (const check of checks) {
    const res = evaluateRateLimit(check.key, check.config, true);
    if (res.remaining < minRemaining) {
      minRemaining = res.remaining;
    }
    if (res.resetAt > maxResetAt) {
      maxResetAt = res.resetAt;
    }
  }

  return {
    allowed: true,
    limit: checks[0]?.config.limit || 0,
    remaining: minRemaining === Infinity ? 0 : minRemaining,
    resetAt: maxResetAt,
    retryAfter: 0,
  };
}

/**
 * Securely extracts client IP from request headers.
 */
export function getClientIp(req: Request): string {
  // In order of reliability
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0].trim();
    if (ip) return ip;
  }

  return "127.0.0.1";
}

/**
 * Generates standard rate limit headers.
 */
export function getRateLimitHeaders(res: RateLimitResult | CheckMultipleResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(res.limit),
    "X-RateLimit-Remaining": String(res.remaining),
    "X-RateLimit-Reset": String(Math.ceil(res.resetAt / 1000)),
  };

  if (!res.allowed) {
    headers["Retry-After"] = String(res.retryAfter);
  }

  return headers;
}

// Config for register API: 100 requests per 1 minute (relaxed for testing)
export const REGISTER_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  blockDurationMs: 1000, // 1 second block
  escalatedBlockLimit: 200,
  escalatedBlockDurationMs: 10 * 1000, // 10 seconds block
};

// Config for login API (IP basis): 200 requests per 1 minute (relaxed for testing)
export const LOGIN_IP_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  limit: 200,
  blockDurationMs: 1000, // 1 second block
  escalatedBlockLimit: 400,
  escalatedBlockDurationMs: 10 * 1000, // 10 seconds block
};

// Config for login API (Identifier basis): 200 requests per 1 minute (relaxed for testing)
export const LOGIN_ID_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  limit: 200,
  blockDurationMs: 1000, // 1 second block
  escalatedBlockLimit: 400,
  escalatedBlockDurationMs: 10 * 1000, // 10 seconds block
};

// Config for contact API: 100 requests per 1 minute (relaxed for testing)
export const CONTACT_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  blockDurationMs: 1000, // 1 second block
  escalatedBlockLimit: 200,
  escalatedBlockDurationMs: 10 * 1000, // 10 seconds block
};

// Hardened configuration for Admin Login (Zero tolerance against brute-force)
export const ADMIN_LOGIN_IP_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // Max 10 attempts per IP
  blockDurationMs: 15 * 60 * 1000, // 15 minute block
  escalatedBlockLimit: 20,
  escalatedBlockDurationMs: 60 * 60 * 1000, // 1 hour block for sustained attacks
};

export const ADMIN_LOGIN_ID_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // Max 5 attempts per account
  blockDurationMs: 15 * 60 * 1000, // 15 minute block
  escalatedBlockLimit: 10,
  escalatedBlockDurationMs: 60 * 60 * 1000, // 1 hour block
};
