const CARD_DIGITS = /^\d{13,19}$/;
const CVC = /^\d{3,4}$/;
const EXPIRY = /^(0[1-9]|1[0-2])\/(\d{2})$/;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string) {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function luhnOk(cardNumber: string) {
  const digits = digitsOnly(cardNumber);
  if (!CARD_DIGITS.test(digits)) return false;

  let sum = 0;
  let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function expiryOk(value: string, from = new Date()) {
  const match = EXPIRY.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const lastDay = new Date(year, month, 0);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay >= from;
}

export function cvcOk(value: string) {
  return CVC.test(value.trim());
}

export function cardholderOk(value: string) {
  return value.trim().length >= 2;
}

export function walletPhoneOk(value: string) {
  const digits = digitsOnly(value);
  return digits.length >= 10 && digits.length <= 15;
}

export const WALLET_PROVIDERS = ["instapay", "vodafone", "orange", "etisalat"] as const;
export type WalletProvider = (typeof WALLET_PROVIDERS)[number];
