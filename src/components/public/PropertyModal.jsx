import { useEffect, useState } from 'react';
import Icon from './Icon';
import GaleriaMultimedia from './GaleriaMultimedia';
import VisorPdf from './VisorPdf';
import whatsappIcono from '../../assets/whatsapp.png';
import { useConfig } from '../../hooks/useConfig';
import { linkWhatsApp, linkTelefono, linkCorreo } from '../../utils/contacto';
import { formatearPrecio, formatearSuperficie, IMAGEN_VACIA } from '../../utils/propiedades';

export default function PropertyModal({ propiedad, onClose }) {
  const { config } = useConfig();
  const [documentoAbierto, setDocumentoAbierto] = useState(null);

  // Evita que la página de fondo se desplace mientras el detalle está abierto
  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflowPrevio;
    };
  }, []);

  // Escape cierra el detalle (si el visor de PDF está abierto, Escape solo cierra el visor)
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && !documentoAbierto && onClose();
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [onClose, documentoAbierto]);

  const imagenes = propiedad.imagenes.length > 0 ? propiedad.imagenes : [IMAGEN_VACIA];
  const referencia = propiedad.direccion && propiedad.direccion !== propiedad.ubicacion ? propiedad.direccion : '';
  const mapaQuery = encodeURIComponent([referencia, propiedad.ubicacion].filter(Boolean).join(', '));
  const mensaje = `Hola, me interesa obtener información sobre: ${propiedad.titulo} (${propiedad.ubicacion})`;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#0b211a]/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${propiedad.titulo}`}
    >
      <article
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white text-[#17352b] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-2xl shadow-lg"
          aria-label="Cerrar detalles"
        >
          ×
        </button>

        <GaleriaMultimedia imagenes={imagenes} videos={propiedad.videos} titulo={propiedad.titulo} />

        <div className="p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#718b2c]">{propiedad.ubicacion}</p>
              <h2 className="mt-2 font-display text-4xl">{propiedad.titulo}</h2>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-[#6d7d76]">Precio</p>
              <p className="text-2xl font-bold">{formatearPrecio(propiedad.precio)}</p>
            </div>
          </div>

          {propiedad.descripcion && <p className="mt-6 leading-7 text-[#6d7d76]">{propiedad.descripcion}</p>}

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f7f6f1] p-4">
              <Icon name="ruler" className="mb-2 h-5 w-5 text-[#718b2c]" />
              <p className="text-xs text-[#6d7d76]">Superficie</p>
              <p className="mt-1 font-bold">{formatearSuperficie(propiedad.superficie)}</p>
            </div>
            <div className="rounded-xl bg-[#f7f6f1] p-4">
              <Icon name="map" className="mb-2 h-5 w-5 text-[#718b2c]" />
              <p className="text-xs text-[#6d7d76]">Tipo</p>
              <p className="mt-1 font-bold">{propiedad.tipo}</p>
            </div>
            <div className="rounded-xl bg-[#f7f6f1] p-4">
              <Icon name="check" className="mb-2 h-5 w-5 text-[#718b2c]" />
              <p className="text-xs text-[#6d7d76]">Estado</p>
              <p className="mt-1 font-bold">{propiedad.situacion}</p>
            </div>
          </div>

          {propiedad.documentos.length > 0 && (
            <div className="mt-7">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7d76]">Documentos</h3>
              <ul className="mt-3 space-y-2">
                {propiedad.documentos.map((doc) => (
                  <li key={doc.url}>
                    <button
                      type="button"
                      onClick={() => setDocumentoAbierto(doc)}
                      className="flex w-full items-center gap-3 rounded-xl border border-[#17352b]/10 bg-[#f7f6f1] px-4 py-3 text-left transition hover:border-[#718b2c] hover:bg-[#e8f2c4]/50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-rose-600">PDF</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{doc.nombre}</span>
                        <span className="text-xs text-[#6d7d76]">{doc.paginas} {doc.paginas === 1 ? 'página' : 'páginas'} · Ver vista previa</span>
                      </span>
                      <Icon name="arrow" className="h-4 w-4 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6d7d76]">
            {referencia && <span>Referencia: {referencia}</span>}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapaQuery}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#17352b] underline-offset-4 hover:underline"
            >
              Ver ubicación en Google Maps ➔
            </a>
          </div>

          <div className="mt-8 flex flex-col flex-wrap gap-3 border-t border-[#17352b]/10 pt-6 sm:flex-row">
            <a
              href={linkWhatsApp(config.whatsapp, mensaje)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d8ed8d] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#c8e274]"
            >
              <img src={whatsappIcono} alt="" className="h-5 w-5" /> Escribir por WhatsApp
            </a>
            <a
              href={linkTelefono(config.telefono)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17352b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#285545]"
            >
              <Icon name="phone" /> Llamar a un asesor
            </a>
            {config.correo && (
              <a
                href={linkCorreo(config.correo, `Información sobre ${propiedad.titulo}`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#17352b]/20 px-6 py-3.5 text-sm font-semibold"
              >
                <Icon name="mail" /> Pedir información
              </a>
            )}
          </div>
        </div>
      </article>

      {documentoAbierto && <VisorPdf documento={documentoAbierto} onClose={() => setDocumentoAbierto(null)} />}
    </div>
  );
}
