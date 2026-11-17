import Icon from './Icon';
import { RANGOS_PRECIO, RANGOS_SUPERFICIE, SITUACIONES, ORDENES, TIPOS } from '../../utils/propiedades';

const claseCampo = 'rounded-xl border border-[#17352b]/10 bg-white px-4 py-2.5';
const claseEtiqueta = 'block text-[10px] font-bold uppercase tracking-widest text-[#6d7d76]';
const claseControl = 'mt-1 w-full bg-transparent text-sm font-semibold outline-none';

function Selector({ etiqueta, valor, onChange, opciones }) {
  return (
    <label className={claseCampo}>
      <span className={claseEtiqueta}>{etiqueta}</span>
      <select value={valor} onChange={(e) => onChange(e.target.value)} className={claseControl}>
        {opciones.map((op) => (
          <option key={op.id} value={op.id}>
            {op.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chips({ etiqueta, opciones, valor, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={valor === o.id}
          className={`rounded-full px-4 py-2 text-xs font-bold transition ${
            valor === o.id
              ? 'bg-[#17352b] text-white'
              : 'border border-[#17352b]/10 bg-white text-[#17352b] hover:bg-[#e8f2c4]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function CatalogFilters({ filtros, ubicaciones, onChange, onLimpiar, hayFiltros }) {
  const opcionesUbicacion = [
    { id: '', label: 'Todas las ubicaciones' },
    ...ubicaciones.map((u) => ({ id: u, label: u })),
  ];

  return (
    <div className="mb-8 rounded-2xl bg-[#f7f6f1] p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className={`${claseCampo} sm:col-span-2 lg:col-span-1`}>
          <span className={claseEtiqueta}>Buscar</span>
          <span className="flex items-center gap-2">
            <Icon name="search" className="mt-1 h-4 w-4 shrink-0 text-[#6d7d76]" />
            <input
              type="search"
              value={filtros.busqueda}
              onChange={(e) => onChange('busqueda', e.target.value)}
              placeholder="Nombre o ubicación"
              className={claseControl}
            />
          </span>
        </label>

        <Selector etiqueta="Ubicación" valor={filtros.ubicacion} onChange={(v) => onChange('ubicacion', v)} opciones={opcionesUbicacion} />
        <Selector etiqueta="Presupuesto" valor={filtros.precio} onChange={(v) => onChange('precio', v)} opciones={RANGOS_PRECIO} />
        <Selector etiqueta="Superficie" valor={filtros.superficie} onChange={(v) => onChange('superficie', v)} opciones={RANGOS_SUPERFICIE} />
        <Selector etiqueta="Ordenar por" valor={filtros.orden} onChange={(v) => onChange('orden', v)} opciones={ORDENES} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Chips etiqueta="Filtrar por tipo" opciones={TIPOS} valor={filtros.tipo} onChange={(v) => onChange('tipo', v)} />
          <Chips etiqueta="Filtrar por estado" opciones={SITUACIONES} valor={filtros.situacion} onChange={(v) => onChange('situacion', v)} />
        </div>

        {hayFiltros && (
          <button
            type="button"
            onClick={onLimpiar}
            className="flex items-center gap-1.5 text-xs font-bold text-[#17352b] underline-offset-4 hover:underline"
          >
            <Icon name="close" className="h-3.5 w-3.5" /> Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
