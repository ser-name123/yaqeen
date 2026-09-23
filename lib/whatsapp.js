/**
 * Helper to get the canonical WhatsApp link across the entire application.
 * If custom Whatsapp link / number is configured in site_settings (Admin), it will respect it.
 * Otherwise, falls back to the default Yaqeen Institute WhatsApp direct chat link.
 */

export const DEFAULT_WHATSAPP_PHONE = "447488848483";
export const DEFAULT_WHATSAPP_TEXT = "Assalamu Alaikum! I'm interested in learning more about Yaqeen Institute and your courses.";
export const DEFAULT_WHATSAPP_LINK = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(DEFAULT_WHATSAPP_TEXT)}`;

export function getWhatsAppLink(customWhatsapp = "", customPhone = "") {
  // 1. If admin provided a full URL (wa.me, api.whatsapp.com, etc.)
  if (customWhatsapp && typeof customWhatsapp === "string") {
    const trimmed = customWhatsapp.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("wa.me/")) {
      return `https://${trimmed}`;
    }
    const cleanDigits = trimmed.replace(/[^\d]/g, "");
    if (cleanDigits.length >= 7) {
      return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(DEFAULT_WHATSAPP_TEXT)}`;
    }
  }

  // 2. If contact phone is provided
  if (customPhone && typeof customPhone === "string") {
    const cleanDigits = customPhone.replace(/[^\d]/g, "");
    if (cleanDigits.length >= 7) {
      return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(DEFAULT_WHATSAPP_TEXT)}`;
    }
  }

  // 3. Fallback to default
  return DEFAULT_WHATSAPP_LINK;
}
