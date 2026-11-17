import { Building2, CheckCircle2, Clock, XCircle, Eye, Activity } from 'lucide-react';

export default function AdminDashboard({ properties }) {
  // Conteo dinámico independiente de mayúsculas/minúsculas
  const total = properties.length;
  const disponibles = properties.filter(p => (p.estado || p.category || '').toLowerCase() === 'disponible').length;
  const apartadas = properties.filter(p => (p.estado || p.category || '').toLowerCase() === 'apartado').length;
  const vendidas = properties.filter(p => (p.estado || p.category || '').toLowerCase() === 'vendido').length;

  return (
    <div className="space-y-8">
      {/* Tarjetas de métricas idénticas al diseño de referencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Total de propiedades</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{total}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Inventario actual</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Disponibles</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{disponibles}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Inventario actual</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Apartadas</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{apartadas}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Inventario actual</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Vendidas</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{vendidas}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Inventario actual</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Visitas acumuladas</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">4,530</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Últimos 30 días</span>
        </div>
      </div>

      {/* Sección inferior: Rendimiento y Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Propiedades más recientes / vistas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-serif font-bold text-[#12382F]">Propiedades registradas</h3>
          </div>

          <div className="space-y-4">
            {properties.slice(0, 4).map((prop, index) => (
              <div key={prop._id || index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-4">0{index + 1}</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#12382F]">{prop.titulo || prop.title}</h4>
                    <p className="text-[11px] text-slate-500">{prop.ubicacion?.direccion || prop.location || 'Ubicación general'}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  ${Number(prop.precio || prop.price || 0).toLocaleString()} MXN
                </span>
              </div>
            ))}
            {properties.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No hay propiedades registradas todavía.</p>
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#12382F] mb-6">Actividad reciente</h3>
          
          <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 text-xs">
            <div className="relative pl-6">
              <span className="absolute left-0.5 top-1.5 w-3 h-3 rounded-full bg-[#D8EF8B] border-2 border-white shadow-sm"></span>
              <p className="font-bold text-[#12382F]">Base de datos sincronizada</p>
              <p className="text-[11px] text-slate-500">Conexión exitosa a MongoDB Compass</p>
              <span className="text-[9px] text-slate-400 block mt-1">Hace un momento</span>
            </div>

            <div className="relative pl-6">
              <span className="absolute left-0.5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></span>
              <p className="font-bold text-[#12382F]">Nuevo registro habilitado</p>
              <p className="text-[11px] text-slate-500">Formulario conectado a Cloudinary</p>
              <span className="text-[9px] text-slate-400 block mt-1">Hoy</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}