import { createContext } from 'react';

// Se usan mientras carga la API o si el backend no responde
export const CONFIG_POR_DEFECTO = {
  nombreComercial: 'Inmobiliaria Ramírez',
  telefono: '9618130385',
  whatsapp: '9618130385',
  correo: '',
  horario: 'Lunes a viernes · 9:00 - 18:00',
  logo: '',
};

export const ConfigContext = createContext({
  config: CONFIG_POR_DEFECTO,
  cargando: false,
  recargarConfig: async () => {},
});
