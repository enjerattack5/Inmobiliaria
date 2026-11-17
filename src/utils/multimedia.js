import { subirArchivos, subirDocumentos } from '../services/api';

// Estado de fotos, videos y PDF de una propiedad mientras se edita:
//  - imagenes / videos / documentos: ya están guardados (URLs de Cloudinary)
//  - archivos / pdfs: archivos nuevos elegidos en el navegador, aún sin subir
export const MULTIMEDIA_VACIA = { imagenes: [], videos: [], documentos: [], archivos: [], pdfs: [] };

export const multimediaDe = (propiedad) => ({
  imagenes: [...(propiedad.imagenes || [])],
  videos: [...(propiedad.videos || [])],
  documentos: [...(propiedad.documentos || [])],
  archivos: [],
  pdfs: [],
});

// Sube lo nuevo y devuelve las listas finales que se guardan en MongoDB
export const prepararMultimedia = async (media) => {
  let imagenes = [...media.imagenes];
  let videos = [...media.videos];
  let documentos = [...media.documentos];

  if (media.archivos.length > 0) {
    const subidos = await subirArchivos(media.archivos);
    imagenes = [...imagenes, ...subidos.imagenes];
    videos = [...videos, ...subidos.videos];
  }
  if (media.pdfs.length > 0) {
    const subidos = await subirDocumentos(media.pdfs);
    documentos = [...documentos, ...subidos.documentos];
  }

  return { imagenes, videos, documentos };
};
