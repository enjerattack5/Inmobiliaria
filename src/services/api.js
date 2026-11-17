// URL base del backend. Se puede cambiar con VITE_API_URL en frontend/.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const PROPIEDADES = `${API_URL}/properties`;
const AUTH = `${API_URL}/auth`;

// ---------- Sesión del administrador ----------

const CLAVE_TOKEN = 'inmobiliaria_admin_token';
export const EVENTO_SESION_EXPIRADA = 'sesion-expirada';

const leerToken = () => {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
};
const guardarToken = (token) => {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
  } catch {
    /* sin almacenamiento disponible */
  }
};
const borrarToken = () => {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    /* sin almacenamiento disponible */
  }
};

export const haySesion = () => Boolean(leerToken());

// ---------- Utilidades de red ----------

// Lee la respuesta como JSON; si el servidor devuelve otra cosa, lanza un error legible
const leerRespuesta = async (res) => {
  const texto = await res.text();
  let data;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch {
    throw new Error(`El servidor respondió con un formato inesperado (HTTP ${res.status})`);
  }
  if (!res.ok) throw new Error(data?.mensaje || data?.error || `Error HTTP ${res.status}`);
  return data;
};

// Petición que lleva la sesión del admin. Si el servidor responde 401, se cierra la sesión.
const pedirConSesion = async (url, opciones = {}) => {
  const headers = { ...opciones.headers };
  const token = leerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...opciones, headers });
  if (res.status === 401) {
    borrarToken();
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
  }
  return leerRespuesta(res);
};

const enviarJSON = (url, method, body) =>
  pedirConSesion(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// ---------- Autenticación ----------

export const iniciarSesion = async (usuario, password) => {
  const res = await fetch(`${AUTH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  });
  const datos = await leerRespuesta(res);
  guardarToken(datos.token);
  return datos;
};

export const cerrarSesion = () => borrarToken();

// Comprueba que la sesión guardada siga vigente (si no, se dispara EVENTO_SESION_EXPIRADA)
export const verificarSesion = () => pedirConSesion(`${AUTH}/yo`);

// ---------- Propiedades ----------

export const obtenerPropiedades = () => fetch(PROPIEDADES).then(leerRespuesta);
export const crearPropiedad = (datos) => enviarJSON(PROPIEDADES, 'POST', datos);
export const actualizarPropiedad = (id, datos) => enviarJSON(`${PROPIEDADES}/${id}`, 'PUT', datos);
export const eliminarPropiedad = (id) => pedirConSesion(`${PROPIEDADES}/${id}`, { method: 'DELETE' });

const subirFormData = (ruta, campo, archivos) => {
  const formData = new FormData();
  Array.from(archivos).forEach((archivo) => formData.append(campo, archivo));
  return pedirConSesion(`${PROPIEDADES}/${ruta}`, { method: 'POST', body: formData });
};

// Fotos y videos → Cloudinary. Devuelve { imagenes: [], videos: [] }
export const subirArchivos = (archivos) => subirFormData('upload', 'archivos', archivos);

// PDF → Cloudinary. Devuelve { documentos: [{ nombre, url, paginas }] }
export const subirDocumentos = (archivos) => subirFormData('upload-pdf', 'documentos', archivos);

// Suma un clic a la propiedad (alimenta las estadísticas del admin). No bloquea ni muestra errores.
const ultimosClics = new Map();
export const registrarClic = (id) => {
  const ahora = Date.now();
  if (ahora - (ultimosClics.get(id) || 0) < 3000) return; // evita contar doble clic
  ultimosClics.set(id, ahora);
  fetch(`${PROPIEDADES}/${id}/clic`, { method: 'POST', keepalive: true }).catch(() => {});
};

// ---------- Configuración del negocio ----------

export const obtenerConfiguracion = () => fetch(`${API_URL}/config`).then(leerRespuesta);
export const guardarConfiguracion = (datos) => enviarJSON(`${API_URL}/config`, 'PUT', datos);
