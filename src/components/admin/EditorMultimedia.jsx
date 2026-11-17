import { X, ImagePlus, FileText, Film, Star } from 'lucide-react';

const MAX_ARCHIVOS_NUEVOS = 10;
const MAX_PDFS_NUEVOS = 5;
const MAX_PDF_MB = 100;

const mismoArchivo = (a, b) => a.name === b.name && a.size === b.size;

// Editor de fotos, videos y PDF: sirve para registrar y para editar una propiedad.
// media = { imagenes, videos, documentos, archivos, pdfs } (ver utils/multimedia.js)
export default function EditorMultimedia({ media, onChange, deshabilitado = false }) {
  const cambiar = (parcial) => onChange({ ...media, ...parcial });

  const agregarArchivos = (e) => {
    const elegidos = Array.from(e.target.files || []);
    e.target.value = ''; // permite volver a elegir el mismo archivo
    const nuevos = elegidos.filter((f) => !media.archivos.some((x) => mismoArchivo(x, f)));
    const cupo = MAX_ARCHIVOS_NUEVOS - media.archivos.length;
    if (nuevos.length > cupo) alert(`Solo se pueden subir ${MAX_ARCHIVOS_NUEVOS} archivos a la vez. Guarda y vuelve a agregar el resto.`);
    cambiar({ archivos: [...media.archivos, ...nuevos.slice(0, Math.max(cupo, 0))] });
  };

  const agregarPdfs = (e) => {
    const elegidos = Array.from(e.target.files || []);
    e.target.value = '';
    const validos = elegidos.filter((f) => {
      if (f.size > MAX_PDF_MB * 1024 * 1024) {
        alert(`"${f.name}" pesa más de ${MAX_PDF_MB} MB y no se puede subir.`);
        return false;
      }
      return !media.pdfs.some((x) => mismoArchivo(x, f));
    });
    const cupo = MAX_PDFS_NUEVOS - media.pdfs.length;
    cambiar({ pdfs: [...media.pdfs, ...validos.slice(0, Math.max(cupo, 0))] });
  };

  const quitarDe = (campo, indice) => cambiar({ [campo]: media[campo].filter((_, i) => i !== indice) });

  const hacerPortada = (indice) => {
    const imagenes = [...media.imagenes];
    const [elegida] = imagenes.splice(indice, 1);
    cambiar({ imagenes: [elegida, ...imagenes] });
  };

  const claseChip = 'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700';
  const botonQuitar = 'ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-600';

  return (
    <fieldset disabled={deshabilitado} className="space-y-6">
      {/* ---------- Fotos y videos ---------- */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Fotos y videos</p>

        {media.imagenes.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {media.imagenes.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 ? (
                  <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-[#D8EF8B] px-2 py-0.5 text-[9px] font-bold text-[#12382F]">
                    <Star size={9} /> Portada
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => hacerPortada(i)}
                    className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#12382F] opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"
                  >
                    Hacer portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => quitarDe('imagenes', i)}
                  aria-label={`Quitar foto ${i + 1}`}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-rose-600 shadow hover:bg-rose-600 hover:text-white"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {(media.videos.length > 0 || media.archivos.length > 0) && (
          <ul className="space-y-2">
            {media.videos.map((url, i) => (
              <li key={url} className={claseChip}>
                <Film size={14} className="shrink-0 text-slate-400" /> Video {i + 1} (guardado)
                <button type="button" onClick={() => quitarDe('videos', i)} aria-label={`Quitar video ${i + 1}`} className={botonQuitar}>
                  <X size={13} />
                </button>
              </li>
            ))}
            {media.archivos.map((archivo, i) => (
              <li key={`${archivo.name}-${archivo.size}`} className={`${claseChip} border-emerald-200 bg-emerald-50`}>
                {archivo.type.startsWith('video/') ? <Film size={14} className="shrink-0 text-emerald-600" /> : <ImagePlus size={14} className="shrink-0 text-emerald-600" />}
                <span className="truncate">{archivo.name}</span>
                <span className="shrink-0 text-[10px] font-bold text-emerald-700">nuevo</span>
                <button type="button" onClick={() => quitarDe('archivos', i)} aria-label={`Quitar ${archivo.name}`} className={botonQuitar}>
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 px-4 py-5 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40">
          <ImagePlus className="mb-1 text-emerald-600" size={22} />
          <span className="text-sm font-semibold text-slate-700">Agregar fotos o videos</span>
          <span className="mt-0.5 text-xs text-slate-400">PNG, JPG, WEBP o videos (100 MB c/u). Las fotos nuevas se agregan al final.</span>
          <input type="file" accept="image/*,video/*" multiple onChange={agregarArchivos} className="hidden" />
        </label>
      </div>

      {/* ---------- Documentos PDF ---------- */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Documentos PDF (planos, fichas técnicas)</p>

        {(media.documentos.length > 0 || media.pdfs.length > 0) && (
          <ul className="space-y-2">
            {media.documentos.map((doc, i) => (
              <li key={doc.url} className={claseChip}>
                <FileText size={14} className="shrink-0 text-rose-500" />
                <span className="truncate">{doc.nombre}</span>
                <span className="shrink-0 text-[10px] text-slate-400">{doc.paginas} pág.</span>
                <button type="button" onClick={() => quitarDe('documentos', i)} aria-label={`Quitar ${doc.nombre}`} className={botonQuitar}>
                  <X size={13} />
                </button>
              </li>
            ))}
            {media.pdfs.map((archivo, i) => (
              <li key={`${archivo.name}-${archivo.size}`} className={`${claseChip} border-emerald-200 bg-emerald-50`}>
                <FileText size={14} className="shrink-0 text-emerald-600" />
                <span className="truncate">{archivo.name}</span>
                <span className="shrink-0 text-[10px] font-bold text-emerald-700">nuevo</span>
                <button type="button" onClick={() => quitarDe('pdfs', i)} aria-label={`Quitar ${archivo.name}`} className={botonQuitar}>
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40">
          <FileText size={18} className="text-rose-500" /> Agregar PDF
          <span className="text-xs font-normal text-slate-400">(máx. {MAX_PDF_MB} MB)</span>
          <input type="file" accept="application/pdf" multiple onChange={agregarPdfs} className="hidden" />
        </label>
        <p className="text-[11px] text-slate-400">Los clientes verán una vista previa del PDF dentro de la propiedad, sin botón de descarga.</p>
      </div>
    </fieldset>
  );
}
