import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a WhatsApp URL for a phone number that optionally includes a
 * prefilled message. The function strips out non-digits, ensures a
 * default country code (55) and returns a link suitable for
 * `window.open` or anchor hrefs.
 */
export function whatsappLink(phone: string, text?: string) {
  let num = phone.replace(/\D/g, "");
  if (num.startsWith("0")) {
    num = num.slice(1);
  }
  if (!num.startsWith("55")) {
    num = "55" + num;
  }
  let url = `https://wa.me/${num}`;
  if (text) {
    url += `?text=${encodeURIComponent(text)}`;
  }
  return url;
}
