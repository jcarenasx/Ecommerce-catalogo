export function buildWhatsAppUrl(message: string): string {
  const phone = "5215564934616";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
