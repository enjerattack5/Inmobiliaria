// Arma el link de WhatsApp. Si el número tiene 10 dígitos se le agrega la lada de México (52).
export const linkWhatsApp = (numero, mensaje = '') => {
  let digitos = String(numero || '').replace(/\D/g, '');
  if (digitos.length === 10) digitos = `52${digitos}`;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${digitos}${texto}`;
};

// Deja solo dígitos para usar en enlaces tel:
export const linkTelefono = (numero) => `tel:${String(numero || '').replace(/[^\d+]/g, '')}`;

// Link para escribir un correo con asunto prellenado
export const linkCorreo = (correo, asunto = '') =>
  `mailto:${correo}${asunto ? `?subject=${encodeURIComponent(asunto)}` : ''}`;
