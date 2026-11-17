import { useState, useEffect } from 'react';
import Icon from './Icon';
import { urlPaginaPdf } from '../../utils/propiedades';

// Vista previa de un PDF página por página (como imágenes). No ofrece botón de descarga.
export default function VisorPdf({ documento, onClose }) {
  const total = Math.max(1, Number(documento.paginas) || 1);
  const [pagina, setPagina] = useState(1);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | error

  const irA = (n) => {
    const destino = Math.min(Math.max(n, 1), total);
    if (destino === pagina) return;
    setEstado('cargando');
    setPagina(destino);
  };

  // Teclado: Esc cierra, flechas cambian de página
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') irA(pagina + 1);
      if (e.key === 'ArrowLeft') irA(pagina - 1);
    };
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  });

  const boton = 'grid h-11 w-11 place-items-center rounded-full bg-white/90 text-xl text-[#17352b] shadow-lg transition hover:bg-white disabled:opacity-30 disabled:hover:bg-white/90';

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[#0b211a]/95 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation(); // que el clic no llegue al detalle de la propiedad y lo cierre también
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa de ${documento.nombre}`}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{documento.nombre}</p>
          <p className="text-xs text-white/60">
            Página {pagina} de {total}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista previa"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
        <button type="button" onClick={(e) => { e.stopPropagation(); irA(pagina - 1); }} disabled={pagina <= 1} aria-label="Página anterior" className={`${boton} absolute left-3 z-10 sm:left-6`}>
          ‹
        </button>

        <div className="flex max-h-full max-w-4xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {estado === 'cargando' && <p className="absolute text-sm text-white/70">Cargando vista previa...</p>}
          {estado === 'error' ? (
            <p className="max-w-xs rounded-2xl bg-white p-6 text-center text-sm text-[#17352b]">
              No pudimos cargar la vista previa de este documento. Intenta de nuevo más tarde.
            </p>
          ) : (
            <img
              key={pagina}
              src={urlPaginaPdf(documento.url, pagina)}
              alt={`${documento.nombre}, página ${pagina}`}
              draggable={false}
              onLoad={() => setEstado('listo')}
              onError={() => setEstado('error')}
              onContextMenu={(e) => e.preventDefault()}
              className={`max-h-[78vh] select-none rounded-lg bg-white object-contain shadow-2xl ${estado === 'listo' ? '' : 'opacity-0'}`}
            />
          )}
        </div>

        <button type="button" onClick={(e) => { e.stopPropagation(); irA(pagina + 1); }} disabled={pagina >= total} aria-label="Página siguiente" className={`${boton} absolute right-3 z-10 sm:right-6`}>
          ›
        </button>
      </div>
    </div>
  );
}
