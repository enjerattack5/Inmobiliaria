import { LayoutDashboard, Building2, BarChart3, Settings, LogOut } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

export default function AdminSidebar({ activeTab, setActiveTab, onSalir }) {
  const { config } = useConfig();
  const [primeraPalabra, ...resto] = config.nombreComercial.toUpperCase().split(' ');
  return (
    <aside className="w-64 bg-[#17382D] text-white flex flex-col justify-between hidden md:flex border-r border-[#12382F]/20">
      <div>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wide">{primeraPalabra}</h1>
            <p className="text-[10px] text-amber-300 font-bold tracking-widest">{resto.join(' ')}</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 text-xs font-semibold">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 px-3 mb-2">Administración</p>
          
          <button 
            onClick={() => setActiveTab('resumen')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'resumen' ? 'bg-[#D8EF8B] text-[#12382F] font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Resumen general
          </button>

          <button 
            onClick={() => setActiveTab('propiedades')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'propiedades' ? 'bg-[#D8EF8B] text-[#12382F] font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" /> Propiedades
          </button>

          <button 
            onClick={() => setActiveTab('estadisticas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'estadisticas' ? 'bg-[#D8EF8B] text-[#12382F] font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Estadísticas
          </button>

          <button 
            onClick={() => setActiveTab('configuracion')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'configuracion' ? 'bg-[#D8EF8B] text-[#12382F] font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4" /> Configuración
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={onSalir}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}