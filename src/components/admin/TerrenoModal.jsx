import { X, MapPin } from 'lucide-react';
import EditorMultimedia from './EditorMultimedia';

export default function TerrenoModal({
  modalAbierto,
  form,
  media,
  guardando,
  cambiarCampo,
  onMediaChange,
  guardarTerreno,
  cerrarModal,
}) {
  if (!modalAbierto) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
    >
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Gestión de propiedades</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Registrar nueva propiedad</h2>
            <p className="mt-1 text-xs text-slate-500">Sube la información conectada a Cloudinary y MongoDB.</p>
          </div>
          <button onClick={cerrarModal} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={21} />
          </button>
        </div>

        <form onSubmit={guardarTerreno} className="overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* FOTOS, VIDEOS Y PDF */}
          <EditorMultimedia media={media} onChange={onMediaChange} deshabilitado={guardando} />

          {/* CAMPOS DE TEXTO DEL FORMULARIO */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Información general</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de propiedad *</label>
                <select
                  name="tipoInmueble"
                  value={form.tipoInmueble || 'Terreno'}
                  onChange={cambiarCampo}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs bg-white outline-none focus:border-emerald-600 font-semibold text-slate-700"
                >
                  <option value="Terreno">Terreno</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre de la propiedad *</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={form.nombre || ''} 
                  onChange={cambiarCampo} 
                  placeholder="Ej. Lote Residencial Norte, Casa en Lomas..." 
                  maxLength={100} 
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600" 
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ciudad *</label>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad || ''}
                  onChange={cambiarCampo}
                  placeholder="Ej. Villahermosa"
                  maxLength={80}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Estado *</label>
                <input
                  type="text"
                  name="entidad"
                  value={form.entidad || ''}
                  onChange={cambiarCampo}
                  placeholder="Ej. Tabasco"
                  maxLength={80}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2 relative">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Dirección o referencia (opcional)</label>
                <MapPin size={17} className="absolute left-3.5 top-11 text-slate-400" />
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion || ''}
                  onChange={cambiarCampo}
                  placeholder="Calle, colonia o punto de referencia"
                  maxLength={200}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Superficie (m²) *</label>
                <input 
                  type="number" 
                  name="superficie" 
                  value={form.superficie || ''} 
                  onChange={cambiarCampo} 
                  placeholder="500" 
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600" 
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Precio (MXN) *</label>
                <input 
                  type="number" 
                  name="precio" 
                  value={form.precio || ''} 
                  onChange={cambiarCampo} 
                  placeholder="450000" 
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600" 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Disponibilidad</label>
                <select 
                  name="estado" 
                  value={form.estado || 'Disponible'} 
                  onChange={cambiarCampo}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs bg-white outline-none focus:border-emerald-600 font-semibold text-slate-700"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Apartado">Apartado</option>
                  <option value="Vendido">Vendido (no se muestra en el sitio)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion || ''}
                  onChange={cambiarCampo}
                  rows={3}
                  maxLength={600}
                  placeholder="Servicios, accesos, documentación, ventajas del terreno..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={cerrarModal} className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl px-6 py-2.5 text-xs font-bold text-[#12382F] bg-[#D8EF8B] hover:bg-[#ccee70] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : 'Registrar propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}