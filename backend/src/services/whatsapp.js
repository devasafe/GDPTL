const baseUrl = process.env.WHATSAPP_URL_BASE || 'https://wa.me/';

export const buildWhatsappLink = (phone, message) => {
  const texto = encodeURIComponent(message || 'Olá, tenho interesse neste imóvel.');
  return `${baseUrl}${phone}?text=${texto}`;
};
