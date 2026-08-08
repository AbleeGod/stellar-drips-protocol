// validation.ts — input validation for subscription form fields

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Validates XLM amount input */
export function validateAmount(amount: string): ValidationResult {
  const num = parseFloat(amount);
  if (!amount || isNaN(num)) return { valid: false, error: "Amount is required" };
  if (num <= 0)              return { valid: false, error: "Amount must be greater than 0" };
  if (num > 1_000_000)       return { valid: false, error: "Amount exceeds maximum allowed" };
  // fix: minimum balance check — XLM base reserve is 1 XLM (closes #1)
  if (num < 1)               return { valid: false, error: "Minimum subscription amount is 1 XLM" };
  return { valid: true };
}

/** Validates billing interval in days */
export function validateInterval(days: string): ValidationResult {
  const num = parseInt(days, 10);
  if (!days || isNaN(num)) return { valid: false, error: "Interval is required" };
  if (num < 1)             return { valid: false, error: "Interval must be at least 1 day" };
  if (num > 365)           return { valid: false, error: "Interval cannot exceed 365 days" };
  return { valid: true };
}

/** Validates a Stellar public key (G...) */
export function validateAddress(address: string): ValidationResult {
  if (!address)                        return { valid: false, error: "Address is required" };
  if (!address.startsWith("G"))        return { valid: false, error: "Must be a valid Stellar address" };
  if (address.length !== 56)           return { valid: false, error: "Invalid Stellar address length" };
  return { valid: true };
}
