import { useState } from 'react';
import { Eye, Pencil, Trash2, Search, X } from 'lucide-react';
import EditorMultimedia from './EditorMultimedia';
import { actualizarPropiedad, eliminarPropiedad } from '../../services/api';
import { MULTIMEDIA_VACIA, multimediaDe, prepararMultimedia } from '../../utils/multimedia';

export default function AdminProperties({ properties, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  // Estados para los modales de Ver y Editar
  const [selectedProperty, setSelectedProperty] = useState(null); // Para el modal "Ver"
  const [editingProperty, setEditingProperty] = useState(null);   // Para el modal "Editar"
  const [media, setMedia] = useState(MULTIMEDIA_VACIA);            // Fotos, videos y PDF de la propiedad que se edita
  const [guardando, setGuardando] = useState(false);

  const abrirEdicion = (prop) => {
    setMedia(multimediaDe(prop));
    setEditingProperty(prop);
  };

  const cerrarEdicion = () => {
    setEditingProperty(null);
    setMedia(MULTIMEDIA_VACIA);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    try {
      await eliminarPropiedad(id);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(`No se pudo eliminar:\n${error.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingProperty._id || editingProperty.id;
    setGuardando(true);

    try {
      const { imagenes, videos, documentos } = await prepararMultimedia(media);

      await actualizarPropiedad(id, {
        tipoInmueble: editingProperty.tipoInmueble || 'Terreno',
        imagenes,
        videos,
        documentos,
        titulo: editingProperty.titulo || editingProperty.title,
        precio: Number(editingProperty.precio || editingProperty.price),
        ubicacion: {
          ...(editingProperty.ubicacion || {}),
          direccion: editingProperty.ubicacion?.direccion || editingProperty.location,
        },
        caracteristicas: {
          ...(editingProperty.caracteristicas || {}),
          superficieM2: Number(editingProperty.caracteristicas?.superficieM2 || editingProperty.area),
        },
        estado: editingProperty.estado || editingProperty.category || 'Disponible',
        descripcion: editingProperty.descripcion,
      });

      cerrarEdicion();
      onRefresh();
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert(`No se pudo actualizar:\n${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // Filtrado dinámico por buscador y selector de estado
  const filteredProperties = properties.filter((prop) => {
    const titulo = (prop.titulo || prop.title || '').toLowerCase();
    const ubicacion = [prop.ubicacion?.ciudad, prop.ubicacion?.estado, prop.ubicacion?.direccion, prop.location]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const estado = (prop.estado || prop.category || 'Disponible').toLowerCase();

    const matchesSearch = titulo.includes(searchTerm.toLowerCase()) || ubicacion.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || estado === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Barra superior de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar propiedad..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#17382D]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Apartado">Apartado</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>
      </div>

      {/* Tabla del Inventario General */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-serif font-bold text-[#12382F]">Inventario</h3>
          <span className="text-xs text-slate-400">{filteredProperties.length} propiedades encontradas</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-bold">Propiedad</th>
                <th className="pb-3 font-bold">Ubicación</th>
                <th className="pb-3 font-bold">Superficie</th>
                <th className="pb-3 font-bold">Precio</th>
                <th className="pb-3 font-bold">Estado</th>
                <th className="pb-3 font-bold">Visitas</th>
                <th className="pb-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => {
                const id = prop._id || prop.id;
                const titulo = prop.titulo || prop.title || 'Sin título';
                const direccion =
                  [prop.ubicacion?.ciudad, prop.ubicacion?.estado].filter(Boolean).join(', ') ||
                  prop.ubicacion?.direccion ||
                  prop.location ||
                  'Sin ubicación';
                const superficie = prop.caracteristicas?.superficieM2 || prop.area || 0;
                const precio = prop.precio || prop.price || 0;
                const estado = prop.estado || prop.category || 'Disponible';
               const imagen = prop.imagenes?.[0] || prop.imagenLocal || prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100';

                let badgeStyle = "bg-emerald-100 text-emerald-800";
                if (estado.toLowerCase() === 'apartado') badgeStyle = "bg-amber-100 text-amber-800";
                if (estado.toLowerCase() === 'vendido') badgeStyle = "bg-slate-200 text-slate-700";

                return (
                  <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 flex items-center gap-3">
                      <img src={imagen} alt={titulo} className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200" />
                      <span className="font-bold text-[#12382F]">{titulo}</span>
                    </td>
                    <td className="py-4 text-slate-600">{direccion}</td>
                    <td className="py-4 text-slate-600">{superficie} m²</td>
                    <td className="py-4 font-semibold text-[#17382D]">${Number(precio).toLocaleString()} MXN</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {estado}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 font-semibold">{prop.caracteristicas?.visitas ?? 0}</td>
                    <td className="py-4 text-right space-x-2">
                      {/* BOTÓN VER (OJO) */}
                      <button 
                        title="Ver detalles" 
                        onClick={() => setSelectedProperty(prop)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* BOTÓN EDITAR (LÁPIZ) */}
                      <button 
                        title="Editar" 
                        onClick={() => abrirEdicion(prop)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* BOTÓN ELIMINAR (BASURA) */}
                      <button 
                        title="Eliminar"
                        onClick={() => handleDelete(id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: VER DETALLES (OJO)                           */}
      {/* ---------------------------------------------------- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-[#12382F]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl space-y-4">
            <button onClick={() => setSelectedProperty(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-bold text-[#12382F]">Detalles de la Propiedad</h3>
            
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p><strong className="text-[#17382D]">Título:</strong> {selectedProperty.titulo || selectedProperty.title}</p>
                <p><strong className="text-[#17382D]">Tipo:</strong> {selectedProperty.tipoInmueble || 'Terreno'}</p>
                <p><strong className="text-[#17382D]">Ubicación:</strong> {[selectedProperty.ubicacion?.ciudad, selectedProperty.ubicacion?.estado].filter(Boolean).join(', ') || selectedProperty.location}</p>
                {selectedProperty.ubicacion?.direccion && <p><strong className="text-[#17382D]">Dirección:</strong> {selectedProperty.ubicacion.direccion}</p>}
                <p><strong className="text-[#17382D]">Superficie:</strong> {selectedProperty.caracteristicas?.superficieM2 || selectedProperty.area} m²</p>
                <p><strong className="text-[#17382D]">Precio:</strong> ${Number(selectedProperty.precio || selectedProperty.price).toLocaleString()} MXN</p>
                <p><strong className="text-[#17382D]">Estado:</strong> {selectedProperty.estado || selectedProperty.category}</p>
                <p><strong className="text-[#17382D]">Archivos:</strong> {selectedProperty.imagenes?.length || 0} foto(s), {selectedProperty.videos?.length || 0} video(s), {selectedProperty.documentos?.length || 0} PDF</p>
                <p><strong className="text-[#17382D]">Clics:</strong> {selectedProperty.caracteristicas?.visitas ?? 0}</p>
                <p><strong className="text-[#17382D]">Descripción:</strong> {selectedProperty.descripcion || 'Sin descripción registrada'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedProperty(null)} className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#12382F] bg-[#D8EF8B]">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: EDITAR PROPIEDAD (LÁPIZ)                    */}
      {/* ---------------------------------------------------- */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-[#12382F]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-8 relative shadow-2xl">
            <button onClick={cerrarEdicion} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#12382F] mb-1">Editar Propiedad</h3>
            <p className="text-xs text-slate-500 mb-6">Modifica los datos y guárdalos en MongoDB.</p>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#12382F] mb-1">Tipo de propiedad *</label>
                <select
                  value={editingProperty.tipoInmueble || 'Terreno'}
                  onChange={(e) => setEditingProperty({ ...editingProperty, tipoInmueble: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white mb-4"
                >
                  <option value="Terreno">Terreno</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                </select>

                <label className="block font-bold text-[#12382F] mb-1">Nombre de la propiedad *</label>
                <input 
                  type="text" 
                  required 
                  value={editingProperty.titulo || editingProperty.title || ''} 
                  onChange={(e) => setEditingProperty({...editingProperty, titulo: e.target.value, title: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#12382F] mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.ubicacion?.ciudad || ''}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      ubicacion: { ...(editingProperty.ubicacion || {}), ciudad: e.target.value },
                    })}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#12382F] mb-1">Estado *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.ubicacion?.estado || ''}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      ubicacion: { ...(editingProperty.ubicacion || {}), estado: e.target.value },
                    })}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#12382F] mb-1">Dirección o referencia</label>
                <input
                  type="text"
                  value={editingProperty.ubicacion?.direccion || editingProperty.location || ''}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    ubicacion: { ...(editingProperty.ubicacion || {}), direccion: e.target.value },
                    location: e.target.value,
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#12382F] mb-1">Superficie (m²) *</label>
                  <input 
                    type="number"  
                    value={editingProperty.caracteristicas?.superficieM2 || editingProperty.area || ''} 
                    onChange={(e) => setEditingProperty({
                      ...editingProperty, 
                      caracteristicas: { ...(editingProperty.caracteristicas || {}), superficieM2: e.target.value },
                      area: e.target.value
                    })} 
                    className="w-full p-3 rounded-xl border border-slate-200" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#12382F] mb-1">Precio (MXN) *</label>
                  <input 
                    type="number" 
                    required 
                    value={editingProperty.precio || editingProperty.price || ''} 
                    onChange={(e) => setEditingProperty({...editingProperty, precio: e.target.value, price: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-200" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#12382F] mb-1">Disponibilidad</label>
                  <select 
                    value={editingProperty.estado || editingProperty.category || 'Disponible'} 
                    onChange={(e) => setEditingProperty({...editingProperty, estado: e.target.value, category: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Apartado">Apartado</option>
                    <option value="Vendido">Vendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#12382F] mb-1">Descripción</label>
                <textarea
                  rows={3}
                  maxLength={600}
                  value={editingProperty.descripcion || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, descripcion: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <EditorMultimedia media={media} onChange={setMedia} deshabilitado={guardando} />

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={cerrarEdicion} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100">Cancelar</button>
                <button type="submit" disabled={guardando} className="px-6 py-2.5 rounded-xl font-bold text-[#12382F] bg-[#D8EF8B] disabled:opacity-60 disabled:cursor-not-allowed">
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}