"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ── Helpers ─────────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  try {
    const key = "__introlic_sid";
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return "unknown";
  }
}

function getOrCreateVisitorId(): string {
  try {
    if (typeof window === "undefined" || !window.localStorage) return "unknown";
    const key = "__introlic_vid";
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(key, vid);
    }
    return vid;
  } catch {
    return "unknown";
  }
}

function shouldTrackGlobal(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return true;
    const lastTimeRaw = localStorage.getItem("__introlic_last_tracked_global");
    if (!lastTimeRaw) return true;
    
    const lastTime = parseInt(lastTimeRaw, 10);
    if (isNaN(lastTime)) return true;

    // Check if 24 hours have passed (86,400,000 ms)
    const now = Date.now();
    return now - lastTime > 86400000;
  } catch {
    return true; // Fallback to tracking on error
  }
}

function markTrackedGlobal() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("__introlic_last_tracked_global", Date.now().toString());
  } catch {}
}

interface DeviceInfo {
  os: string;
  browser: string;
  screenResolution: string;
  cpuCores: number | null;
  language: string;
}

function parseUserAgent(ua: string): Pick<DeviceInfo, "os" | "browser"> {
  // OS detection
  let os = "Unknown OS";
  if (/Windows NT 10\.0/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
  else if (/Mac OS X/.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    os = match ? `macOS ${match[1].replace(/_/g, ".")}` : "macOS";
  } else if (/Android/.test(ua)) {
    const match = ua.match(/Android ([\d.]+)/);
    os = match ? `Android ${match[1]}` : "Android";
  } else if (/iPhone|iPad/.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/);
    os = match ? `iOS ${match[1].replace(/_/g, ".")}` : "iOS";
  } else if (/Linux/.test(ua)) os = "Linux";
  else if (/CrOS/.test(ua)) os = "Chrome OS";

  // Browser detection
  let browser = "Unknown Browser";
  if (/Edg\//.test(ua)) {
    const match = ua.match(/Edg\/([\d.]+)/);
    browser = match ? `Edge ${match[1].split(".")[0]}` : "Edge";
  } else if (/OPR\/|Opera\//.test(ua)) {
    const match = ua.match(/OPR\/([\d.]+)/);
    browser = match ? `Opera ${match[1].split(".")[0]}` : "Opera";
  } else if (/SamsungBrowser\//.test(ua)) {
    const match = ua.match(/SamsungBrowser\/([\d.]+)/);
    browser = match ? `Samsung ${match[1].split(".")[0]}` : "Samsung Browser";
  } else if (/Firefox\//.test(ua)) {
    const match = ua.match(/Firefox\/([\d.]+)/);
    browser = match ? `Firefox ${match[1].split(".")[0]}` : "Firefox";
  } else if (/Chrome\//.test(ua)) {
    const match = ua.match(/Chrome\/([\d.]+)/);
    browser = match ? `Chrome ${match[1].split(".")[0]}` : "Chrome";
  } else if (/Safari\//.test(ua) && /Version\//.test(ua)) {
    const match = ua.match(/Version\/([\d.]+)/);
    browser = match ? `Safari ${match[1].split(".")[0]}` : "Safari";
  }

  return { os, browser };
}

function getFriendlyDeviceName(brand: string, model: string): { deviceBrand: string; deviceModel: string } {
  let friendlyBrand = brand;
  let friendlyModel = model;

  const modelUpper = model.toUpperCase();
  
  if (brand.toLowerCase() === "samsung" || /SM-|GT-/i.test(model)) {
    friendlyBrand = "Samsung";
    
    // Samsung Galaxy mapping
    if (modelUpper.includes("SM-S928")) friendlyModel = "Galaxy S24 Ultra";
    else if (modelUpper.includes("SM-S926")) friendlyModel = "Galaxy S24+";
    else if (modelUpper.includes("SM-S921")) friendlyModel = "Galaxy S24";
    else if (modelUpper.includes("SM-S918")) friendlyModel = "Galaxy S23 Ultra";
    else if (modelUpper.includes("SM-S916")) friendlyModel = "Galaxy S23+";
    else if (modelUpper.includes("SM-S911")) friendlyModel = "Galaxy S23";
    else if (modelUpper.includes("SM-S908")) friendlyModel = "Galaxy S22 Ultra";
    else if (modelUpper.includes("SM-S906")) friendlyModel = "Galaxy S22+";
    else if (modelUpper.includes("SM-S901")) friendlyModel = "Galaxy S22";
    else if (modelUpper.includes("SM-G998")) friendlyModel = "Galaxy S21 Ultra";
    else if (modelUpper.includes("SM-G996")) friendlyModel = "Galaxy S21+";
    else if (modelUpper.includes("SM-G991")) friendlyModel = "Galaxy S21";
    else if (modelUpper.includes("SM-G990")) friendlyModel = "Galaxy S21 FE";
    else if (modelUpper.includes("SM-G988")) friendlyModel = "Galaxy S20 Ultra";
    else if (modelUpper.includes("SM-G981")) friendlyModel = "Galaxy S20";
    else if (modelUpper.includes("SM-F946")) friendlyModel = "Galaxy Z Fold 5";
    else if (modelUpper.includes("SM-F731")) friendlyModel = "Galaxy Z Flip 5";
    else if (modelUpper.includes("SM-A546")) friendlyModel = "Galaxy A54";
    else if (modelUpper.includes("SM-A536")) friendlyModel = "Galaxy A53";
    else if (modelUpper.includes("SM-A346")) friendlyModel = "Galaxy A34";
    else if (modelUpper.includes("SM-A146")) friendlyModel = "Galaxy A14";
    else {
      // Clean up SM- prefix for display
      friendlyModel = model.replace(/^SM-/i, "Galaxy ");
    }
  } else if (brand.toLowerCase() === "apple") {
    friendlyBrand = "Apple";
    if (modelUpper.includes("IPHONE")) friendlyModel = "iPhone";
    else if (modelUpper.includes("IPAD")) friendlyModel = "iPad";
    else if (modelUpper.includes("MACINTOSH")) friendlyModel = "MacBook / Mac";
  }

  return { deviceBrand: friendlyBrand, deviceModel: friendlyModel };
}

function parseDeviceDetails(ua: string): { deviceBrand: string; deviceModel: string } {
  let deviceBrand = "Generic";
  let deviceModel = "PC / Laptop";

  if (/iPhone/i.test(ua)) {
    deviceBrand = "Apple";
    deviceModel = "iPhone";
  } else if (/iPad/i.test(ua)) {
    deviceBrand = "Apple";
    deviceModel = "iPad";
  } else if (/Macintosh/i.test(ua)) {
    deviceBrand = "Apple";
    deviceModel = "MacBook / Mac";
  } else if (/Samsung|SAMSUNG|SM-/i.test(ua)) {
    deviceBrand = "Samsung";
    const match = ua.match(/SAMSUNG[ -]([A-Z0-9_-]+)|(SM-[A-Z0-9]+)/i);
    deviceModel = match ? (match[1] || match[2]) : "Galaxy Device";
  } else if (/Pixel/i.test(ua)) {
    deviceBrand = "Google";
    const match = ua.match(/Pixel\s+([0-9a-zA-Z\s_]+)/i);
    deviceModel = match ? match[0] : "Pixel";
  } else if (/OnePlus|OP[0-9]/i.test(ua)) {
    deviceBrand = "OnePlus";
    const match = ua.match(/(OnePlus\s+[A-Z0-9]+)|(HD1901|IN2011|KB2001)/i);
    deviceModel = match ? match[0] : "OnePlus Device";
  } else if (/Xiaomi|Redmi|POCO|Mi\s+/i.test(ua)) {
    deviceBrand = "Xiaomi";
    const match = ua.match(/(Redmi\s+[A-Z0-9\s_]+)|(POCO\s+[A-Z0-9\s_]+)|(Mi\s+[A-Z0-9\s_]+)/i);
    deviceModel = match ? match[0] : "Xiaomi Device";
  } else if (/Windows/i.test(ua)) {
    deviceBrand = "Windows PC";
    deviceModel = "Desktop / Laptop";
  } else if (/Linux/i.test(ua)) {
    deviceBrand = "Linux PC";
    deviceModel = "Desktop / Laptop";
  }

  return getFriendlyDeviceName(deviceBrand, deviceModel);
}

async function getDetailedDeviceType(ua: string): Promise<string> {
  if (/Mobi|Android/i.test(ua) && !/Tablet|iPad/i.test(ua)) {
    return "mobile";
  } else if (/Tablet|iPad/i.test(ua)) {
    return "tablet";
  }

  // Differentiate Laptop vs Desktop PC using the Battery API
  try {
    if (typeof navigator !== "undefined" && 'getBattery' in navigator) {
      // @ts-ignore
      const battery = await navigator.getBattery();
      if (battery) {
        const hasBattery = battery.chargingTime !== 0 || battery.dischargingTime !== Infinity || battery.level < 1 || !battery.charging;
        if (hasBattery) {
          return "laptop";
        }
      }
    }
  } catch {}

  // MacBook is a laptop
  if (/Macintosh/i.test(ua)) {
    return "laptop";
  }

  return "desktop";
}

function collectDeviceInfo(ua: string): DeviceInfo {
  const { os, browser } = parseUserAgent(ua);

  // Robust screen detection
  let screenResolution = "unknown";
  if (typeof window !== "undefined" && window.screen) {
    screenResolution = `${window.screen.width}x${window.screen.height}`;
  } else if (typeof window !== "undefined") {
    screenResolution = `${window.innerWidth}x${window.innerHeight}`;
  }

  // Robust CPU detection
  let cpuCores: number | null = null;
  if (typeof navigator !== "undefined" && typeof navigator.hardwareConcurrency === "number") {
    cpuCores = navigator.hardwareConcurrency;
  }

  const language = typeof navigator !== "undefined" ? navigator.language || "unknown" : "unknown";

  return { os, browser, screenResolution, cpuCores, language };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const trackPath = pathname;

    // Prevent StrictMode double-fire
    if (lastTracked.current === trackPath) return;
    lastTracked.current = trackPath;

    // Skip admin pages
    if (trackPath.startsWith("/admin")) return;

    const isPptRoute = trackPath === "/ppt" || trackPath.startsWith("/ppt/");

    // Check 24 hour global constraint (allow /ppt to bypass)
    if (!isPptRoute && !shouldTrackGlobal()) return;

    const trackVisit = async () => {
      try {
        const sessionId = getOrCreateSessionId();
        const visitorId = getOrCreateVisitorId();
        
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        let { deviceBrand, deviceModel } = parseDeviceDetails(ua);
        
        // Try userAgentData if available (Chrome/Edge/Opera)
        // @ts-ignore
        if (typeof navigator !== "undefined" && navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === "function") {
          try {
            // @ts-ignore
            const entropy = await navigator.userAgentData.getHighEntropyValues(["model", "platform", "mobile"]);
            if (entropy.model) {
              const friendly = getFriendlyDeviceName(deviceBrand, entropy.model);
              deviceModel = friendly.deviceModel;
              deviceBrand = friendly.deviceBrand;
            }
          } catch {}
        }

        const deviceType = await getDetailedDeviceType(ua);
        const deviceInfo = collectDeviceInfo(ua);

        const res = await fetch("/api/analytics/hit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: trackPath,
            referer: typeof document !== "undefined" ? document.referrer || null : null,
            sessionId,
            visitorId,
            deviceType,
            deviceBrand,
            deviceModel,
            ...deviceInfo,
          }),
        });

        if (res.ok) {
          if (!isPptRoute) {
            markTrackedGlobal();
          }
        }
      } catch {
        // Silently catch analytics tracking failures in production
      }
    };

    trackVisit();
  }, [pathname]);

  useEffect(() => {
    const handleChunkError = (event: any) => {
      const errorMsg = event.message || "";
      const errorName = event.error?.name || "";
      const errorStack = event.error?.stack || "";
      
      let isChunkError = 
        errorMsg.includes("ChunkLoadError") || 
        errorMsg.includes("Loading chunk") || 
        errorMsg.includes("Failed to load chunk") ||
        errorName.includes("ChunkLoadError") ||
        errorStack.includes("ChunkLoadError");

      // Intercept resource load failures for Next.js chunks (MIME block or 404)
      if (!isChunkError && event.target) {
        const target = event.target;
        const tagName = target.tagName;
        if (tagName === "LINK" || tagName === "SCRIPT") {
          const url = target.href || target.src || "";
          if (url.includes("/_next/static/")) {
            isChunkError = true;
          }
        }
      }

      if (isChunkError) {
        try {
          const key = "__introlic_chunk_reloaded";
          const lastReloaded = sessionStorage.getItem(key);
          const now = Date.now();
          if (!lastReloaded || now - parseInt(lastReloaded, 10) > 10000) {
            sessionStorage.setItem(key, now.toString());
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("b", now.toString());
            window.location.replace(currentUrl.toString());
          }
        } catch {
          window.location.reload();
        }
      }
    };

    const handlePromiseError = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (!reason) return;
      
      const reasonStr = reason.toString ? reason.toString() : "";
      const reasonName = reason.name || "";
      const reasonMessage = reason.message || "";
      const reasonStack = reason.stack || "";
      
      const isChunkError = 
        reasonStr.includes("ChunkLoadError") ||
        reasonStr.includes("Loading chunk") ||
        reasonStr.includes("Failed to load chunk") ||
        reasonName.includes("ChunkLoadError") ||
        reasonMessage.includes("ChunkLoadError") ||
        reasonMessage.includes("Loading chunk") ||
        reasonMessage.includes("Failed to load chunk") ||
        reasonStack.includes("ChunkLoadError");

      if (isChunkError) {
        try {
          const key = "__introlic_chunk_reloaded";
          const lastReloaded = sessionStorage.getItem(key);
          const now = Date.now();
          if (!lastReloaded || now - parseInt(lastReloaded, 10) > 10000) {
            sessionStorage.setItem(key, now.toString());
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("b", now.toString());
            window.location.replace(currentUrl.toString());
          }
        } catch {
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handleChunkError, true);
    window.addEventListener("unhandledrejection", handlePromiseError, true);

    return () => {
      window.removeEventListener("error", handleChunkError, true);
      window.removeEventListener("unhandledrejection", handlePromiseError, true);
    };
  }, []);

  return null;
}
