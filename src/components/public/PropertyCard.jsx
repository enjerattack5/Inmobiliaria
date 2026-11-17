import Icon from './Icon';
import { formatearPrecio, formatearSuperficie } from '../../utils/propiedades';

function Etiqueta({ situacion, className = '' }) {
  const color = situacion === 'Apartado' ? 'bg-amber-100 text-amber-800' : 'bg-white/90 text-[#17352b]';
  return (
    <span className={`absolute left-3 top-3 rounded-full font-bold backdrop-blur ${color} ${className}`}>
      {situacion}
    </span>
  );
}

// variante "destacada": tarjeta grande del inicio · variante "compacta": tarjeta del catálogo
export default function PropertyCard({ propiedad, onClick, variante = 'compacta' }) {
  if (variante === 'destacada') {
    return (
      <article
        onClick={onClick}
        className="group cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-[0_12px_40px_rgba(23,53,43,.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(23,53,43,.14)]"
      >
        <div className="relative h-72 overflow-hidden">
          <img
            src={propiedad.imagen}
            alt={`${propiedad.tipo} ${propiedad.titulo}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <Etiqueta situacion={propiedad.situacion} className="!left-4 !top-4 px-3 py-1.5 text-[11px]" />
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#718b2c]">{propiedad.ubicacion}</p>
          <h3 className="mt-2 font-display text-2xl">{propiedad.titulo}</h3>
          <div className="mt-5 flex items-end justify-between border-t border-[#17352b]/10 pt-5">
            <div>
              <span className="flex items-center gap-1.5 text-xs text-[#6d7d76]">
                <Icon name="ruler" className="h-4 w-4" /> {propiedad.tipo} · {formatearSuperficie(propiedad.superficie)}
              </span>
              <p className="mt-1 text-lg font-bold">{formatearPrecio(propiedad.precio)}</p>
            </div>
            <button
              type="button"
              onClick={onClick}
              aria-label={`Ver detalles de ${propiedad.titulo}`}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#e8f2c4] transition group-hover:bg-[#d8ed8d]"
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-[#17352b]/10 bg-[#f7f6f1] text-left transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={propiedad.imagen}
          alt={`${propiedad.tipo} ${propiedad.titulo}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <Etiqueta situacion={propiedad.situacion} className="px-2.5 py-1 text-[10px]" />
      </div>
      <div className="p-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#718b2c]">{propiedad.ubicacion}</p>
        <h3 className="mt-1 truncate font-display text-xl">{propiedad.titulo}</h3>
        <div className="mt-4 flex items-end justify-between border-t border-[#17352b]/10 pt-3">
          <div>
            <p className="text-xs text-[#6d7d76]">
              {propiedad.tipo} · {formatearSuperficie(propiedad.superficie)}
            </p>
            <p className="mt-0.5 text-sm font-bold">{formatearPrecio(propiedad.precio)}</p>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d8ed8d]">
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

// Marcador mientras se cargan los datos
export function PropertyCardSkeleton({ variante = 'compacta' }) {
  const alto = variante === 'destacada' ? 'h-72' : 'h-40';
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#17352b]/10 bg-white">
      <div className={`${alto} bg-[#e8f2c4]/60`} />
      <div className="space-y-3 p-4">
        <div className="h-2.5 w-1/3 rounded bg-[#17352b]/10" />
        <div className="h-5 w-3/4 rounded bg-[#17352b]/10" />
        <div className="h-3 w-1/2 rounded bg-[#17352b]/10" />
      </div>
    </div>
  );
}
