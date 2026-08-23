/**
 * Form Security and Input Sanitization Utilities
 */

/**
 * Strips HTML tags and escapes dangerous characters to prevent XSS.
 */
export function sanitizeInput(val: string | null | undefined): string {
  if (!val) return "";
  
  // 1. Strip HTML tags
  let cleaned = val.replace(/<[^>]*>/g, "");
  
  // 2. Escape special HTML characters
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  
  cleaned = cleaned.replace(/[&<>"'/]/g, (char) => map[char]);
  return cleaned.trim();
}

/**
 * Validates email format with a strict regular expression.
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  // RFC 5322 compliant simple email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates usernames (3 to 50 characters, alphanumeric, underscores, and periods).
 */
export function validateUsername(username: string): boolean {
  if (!username) return false;
  const usernameRegex = /^[a-zA-Z0-9._]{3,50}$/;
  return usernameRegex.test(username);
}

/**
 * Validates password strength:
 * - Length: 8 to 72 characters (bcrypt limit is 72 bytes)
 * - Minimum: 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export function validatePasswordStrength(password: string): boolean {
  if (!password || password.length < 8 || password.length > 32) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[\W_]/.test(password);
  
  return hasUppercase && hasLowercase && hasDigit && hasSpecial;
}

/**
 * Validates Date of Birth values to ensure they form a valid calendar date.
 */
export function validateDateOfBirth(dayStr: string, monthStr: string, yearStr: string): boolean {
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  if (month < 1 || month > 12) return false;
  
  // Verify number of days in the specific month/year
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  
  return true;
}
