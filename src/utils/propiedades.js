// ---------- Utilidades de las propiedades del sitio público ----------

const sinAcentos = (texto = '') =>
  String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Imagen de respaldo cuando una propiedad no tiene fotos
export const IMAGEN_VACIA = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e8f2c4"/><path d="M0 460 200 330l140 90 170-140 290 180v140H0Z" fill="#cfe58a"/><circle cx="610" cy="170" r="48" fill="#f7f6f1"/></svg>'
)}`;

export const formatearPrecio = (valor) => `$${Number(valor || 0).toLocaleString('es-MX')}`;
export const formatearSuperficie = (valor) => `${Number(valor || 0).toLocaleString('es-MX')} m²`;

// Convierte un documento de MongoDB en un objeto simple para las tarjetas y el modal
export const normalizarPropiedad = (p) => {
  const ciudad = p.ubicacion?.ciudad || '';
  const entidad = p.ubicacion?.estado || '';
  const direccion = p.ubicacion?.direccion || '';
  const imagenes = Array.isArray(p.imagenes) ? p.imagenes.filter(Boolean) : [];
  const videos = Array.isArray(p.videos) ? p.videos.filter(Boolean) : [];

  return {
    id: p._id,
    titulo: p.titulo || 'Terreno sin nombre',
    descripcion: p.descripcion || '',
    precio: Number(p.precio) || 0,
    superficie: Number(p.caracteristicas?.superficieM2) || 0,
    tipo: p.tipoInmueble || 'Terreno', // Terreno | Casa | Departamento
    situacion: p.estado || 'Disponible', // Disponible | Apartado | Vendido
    ciudad,
    entidad,
    direccion,
    ubicacion: [ciudad, entidad].filter(Boolean).join(', ') || direccion || 'Ubicación por confirmar',
    imagenes,
    videos,
    documentos: Array.isArray(p.documentos) ? p.documentos.filter((d) => d?.url) : [],
    imagen: imagenes[0] || IMAGEN_VACIA,
    creadaEn: p.createdAt ? new Date(p.createdAt).getTime() : 0,
  };
};

// En el sitio público no se muestran las propiedades vendidas
export const esPublica = (propiedad) => propiedad.situacion.toLowerCase() !== 'vendido';

// Ubicaciones distintas (para el selector de filtros)
export const opcionesUbicacion = (propiedades) =>
  [...new Set(propiedades.map((p) => p.ubicacion))].sort((a, b) => a.localeCompare(b, 'es'));

// ---------- Filtros ----------

export const RANGOS_PRECIO = [
  { id: '', label: 'Cualquier presupuesto' },
  { id: 'hasta-250', label: 'Hasta $250 mil', max: 250000 },
  { id: '250-500', label: '$250 mil a $500 mil', min: 250000, max: 500000 },
  { id: '500-1000', label: '$500 mil a $1 millón', min: 500000, max: 1000000 },
  { id: '1000-2000', label: '$1 a $2 millones', min: 1000000, max: 2000000 },
  { id: 'mas-2000', label: 'Más de $2 millones', min: 2000000 },
];

export const RANGOS_SUPERFICIE = [
  { id: '', label: 'Cualquier superficie' },
  { id: 'hasta-500', label: 'Hasta 500 m²', max: 500 },
  { id: '500-1000', label: '500 a 1,000 m²', min: 500, max: 1000 },
  { id: '1000-2500', label: '1,000 a 2,500 m²', min: 1000, max: 2500 },
  { id: 'mas-2500', label: 'Más de 2,500 m²', min: 2500 },
];

export const TIPOS = [
  { id: '', label: 'Todos' },
  { id: 'Terreno', label: 'Terrenos' },
  { id: 'Casa', label: 'Casas' },
  { id: 'Departamento', label: 'Departamentos' },
];

export const SITUACIONES = [
  { id: '', label: 'Todos' },
  { id: 'Disponible', label: 'Disponibles' },
  { id: 'Apartado', label: 'Apartados' },
];

export const ORDENES = [
  { id: 'recientes', label: 'Más recientes' },
  { id: 'precio-asc', label: 'Precio: menor a mayor' },
  { id: 'precio-desc', label: 'Precio: mayor a menor' },
  { id: 'superficie-desc', label: 'Mayor superficie' },
];

export const FILTROS_INICIALES = {
  busqueda: '',
  ubicacion: '',
  tipo: '',
  precio: '',
  superficie: '',
  situacion: '',
  orden: 'recientes',
};

const COMPARADORES = {
  recientes: (a, b) => b.creadaEn - a.creadaEn,
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  'superficie-desc': (a, b) => b.superficie - a.superficie,
};

const dentroDelRango = (valor, rango) =>
  !rango || ((rango.min == null || valor >= rango.min) && (rango.max == null || valor <= rango.max));

export const hayFiltrosActivos = (filtros) =>
  Object.keys(FILTROS_INICIALES).some((clave) => clave !== 'orden' && filtros[clave] !== '');

export const filtrarPropiedades = (propiedades, filtros) => {
  const texto = sinAcentos(filtros.busqueda.trim());
  const rangoPrecio = RANGOS_PRECIO.find((r) => r.id === filtros.precio);
  const rangoSuperficie = RANGOS_SUPERFICIE.find((r) => r.id === filtros.superficie);

  const resultado = propiedades.filter((p) => {
    if (texto && !sinAcentos(`${p.titulo} ${p.ubicacion} ${p.direccion} ${p.descripcion}`).includes(texto)) return false;
    if (filtros.ubicacion && p.ubicacion !== filtros.ubicacion) return false;
    if (filtros.situacion && p.situacion !== filtros.situacion) return false;
    if (filtros.tipo && p.tipo !== filtros.tipo) return false;
    return dentroDelRango(p.precio, rangoPrecio) && dentroDelRango(p.superficie, rangoSuperficie);
  });

  return resultado.sort(COMPARADORES[filtros.orden] || COMPARADORES.recientes);
};

// ---------- Filtros <-> URL (para compartir una búsqueda: /catalogo?precio=500-1000) ----------

export const leerFiltrosDeURL = (search = '') => {
  const params = new URLSearchParams(search);
  const filtros = { ...FILTROS_INICIALES };
  for (const clave of Object.keys(FILTROS_INICIALES)) {
    const valor = params.get(clave);
    if (valor) filtros[clave] = valor;
  }
  if (!RANGOS_PRECIO.some((r) => r.id === filtros.precio)) filtros.precio = '';
  if (!RANGOS_SUPERFICIE.some((r) => r.id === filtros.superficie)) filtros.superficie = '';
  if (!SITUACIONES.some((s) => s.id === filtros.situacion)) filtros.situacion = '';
  if (!TIPOS.some((t) => t.id === filtros.tipo)) filtros.tipo = '';
  if (!ORDENES.some((o) => o.id === filtros.orden)) filtros.orden = 'recientes';
  return filtros;
};

export const filtrosAURL = (filtros) => {
  const params = new URLSearchParams();
  for (const clave of Object.keys(FILTROS_INICIALES)) {
    if (filtros[clave] && filtros[clave] !== FILTROS_INICIALES[clave]) params.set(clave, filtros[clave]);
  }
  const texto = params.toString();
  return texto ? `?${texto}` : '';
};

// Cloudinary convierte cada página de un PDF en imagen: así el cliente puede ver el documento sin descargarlo
export const urlPaginaPdf = (url, pagina, ancho = 1400) =>
  url.replace('/upload/', `/upload/pg_${pagina},w_${ancho},q_auto:good,f_jpg/`).replace(/\.pdf(\?|$)/i, '.jpg$1');
