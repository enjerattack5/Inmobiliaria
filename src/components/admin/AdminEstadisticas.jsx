import { useState } from 'react';

// Los clics se guardan en caracteristicas.visitas (+1 cada vez que un cliente abre la propiedad en el sitio)
const clicsDe = (p) => p.caracteristicas?.visitas ?? p.visitas ?? p.clicks ?? 0;

export default function AdminEstadisticas({ properties = [] }) {
  const [selectedUbicacion, setSelectedUbicacion] = useState('Todas');
  const [selectedPeriodo, setSelectedPeriodo] = useState('Últimos 30 días');
  const [selectedPropiedad, setSelectedPropiedad] = useState('Todas');

  // 1. Extraer dinámicamente ubicaciones únicas registradas en MongoDB
  const ubicacionesUnicas = [
    'Todas', 
    ...new Set(
      properties
        .map(p => p.ubicacion?.direccion || p.location || p.ubicacion?.ciudad)
        .filter(Boolean)
    )
  ];

  // 2. Filtrado dinámico
  const filteredProperties = properties.filter(p => {
    const direccion = (p.ubicacion?.direccion || p.location || p.ubicacion?.ciudad || '').toLowerCase();
    const titulo = (p.titulo || p.title || '').toLowerCase();

    const matchesUbicacion = selectedUbicacion === 'Todas' || direccion.includes(selectedUbicacion.toLowerCase());
    const matchesPropiedad = selectedPropiedad === 'Todas' || titulo === selectedPropiedad.toLowerCase();

    return matchesUbicacion && matchesPropiedad;
  });

  // Métricas calculadas dinámicamente
  const totalClics = filteredProperties.reduce((acc, p) => acc + clicsDe(p), 0);
  
  const propiedadMasVista = filteredProperties.length > 0
    ? [...filteredProperties].sort((a, b) => clicsDe(b) - clicsDe(a))[0]
    : null;

  const handleReset = () => {
    setSelectedUbicacion('Todas');
    setSelectedPeriodo('Últimos 30 días');
    setSelectedPropiedad('Todas');
  };

  // Encontrar el valor máximo para calcular la altura de las barras verticales
  const maxClicsGrafica = Math.max(...filteredProperties.map(p => clicsDe(p)), 10);

  return (
    <div className="space-y-6">
      {/* Banner Informativo superior */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#F2EBD9] text-xs text-[#8C7A57]">
        Analítica de rendimiento · Visualización de interacciones de propiedades.
      </div>

      {/* ---------------------------------------------------- */}
      {/* FILTROS SUPERIORES                                   */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ubicación</label>
          <select 
            value={selectedUbicacion}
            onChange={(e) => setSelectedUbicacion(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            {ubicacionesUnicas.map((ub, idx) => (
              <option key={idx} value={ub}>{ub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Periodo</label>
          <select 
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="Últimos 30 días">Últimos 30 días</option>
            <option value="Últimos 6 meses">Últimos 6 meses</option>
            <option value="Último año">Último año</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Propiedad</label>
          <select 
            value={selectedPropiedad}
            onChange={(e) => setSelectedPropiedad(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="Todas">Todas las propiedades</option>
            {properties.map((p, idx) => (
              <option key={idx} value={p.titulo || p.title}>{p.titulo || p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <button 
            onClick={handleReset}
            className="w-full py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Restablecer
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TARJETAS DE MÉTRICAS CLAVE                            */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Total de clics</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{totalClics.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">en el periodo</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Propiedades encontradas</span>
          <p className="text-3xl font-serif font-bold text-[#12382F]">{filteredProperties.length}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">en {selectedUbicacion}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Propiedad más vista</span>
          <p className="text-sm font-bold text-[#12382F] truncate mt-1">
            {propiedadMasVista ? (propiedadMasVista.titulo || propiedadMasVista.title) : 'Sin registros'}
          </p>
          <span className="text-[10px] text-slate-400 mt-2 block">
            {propiedadMasVista ? `${clicsDe(propiedadMasVista)} clics registrados` : '0 clics'}
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* COMPARATIVA DE PROPIEDADES MÁS VISTAS                 */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">COMPARATIVA</span>
          <h3 className="text-base font-serif font-bold text-[#12382F]">Propiedades más vistas</h3>
        </div>
        
        <div className="space-y-5">
          {filteredProperties.map((p, index) => {
            const clics = clicsDe(p);
            const maxClics = Math.max(...filteredProperties.map(item => clicsDe(item)), 1);
            const porcentaje = maxClics > 0 ? Math.round((clics / maxClics) * 100) : 0;

            return (
              <div key={p._id || index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#12382F]">{p.titulo || p.title}</span>
                    <p className="text-[10px] text-slate-400">{[p.ubicacion?.ciudad, p.ubicacion?.estado].filter(Boolean).join(', ') || p.ubicacion?.direccion || p.location || 'Sin ubicación'}</p>
                  </div>
                  <span className="text-slate-500 font-semibold">{clics} clics</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5">
                  <div 
                    className="bg-[#17382D] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-[#D8EF8B] font-bold"
                    style={{ width: `${Math.max(porcentaje, 8)}%` }}
                  >
                    {porcentaje}%
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProperties.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">No hay propiedades registradas para este filtro.</p>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TENDENCIA - GRÁFICA DE BARRAS VERTICALES POR PROPIEDAD */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">TENDENCIA</span>
          <h3 className="text-base font-serif font-bold text-[#12382F]">Distribución de clics por propiedad</h3>
          <p className="text-xs text-slate-400">Comparativa gráfica vertical basada en el rendimiento de cada propiedad</p>
        </div>

        {/* Contenedor de la Gráfica de Barras Verticales */}
        <div className="pt-8 pb-4 px-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="h-64 flex items-end justify-around gap-4 border-b border-slate-200 pb-2">
            {filteredProperties.map((p, index) => {
              const clics = clicsDe(p);
              // Altura proporcional en porcentaje (mínimo 10% para que siempre se vea la barra)
              const alturaPorcentaje = Math.max(Math.round((clics / maxClicsGrafica) * 100), 8);
              const nombrePropiedad = p.titulo || p.title || `Propiedad ${index + 1}`;

              return (
                <div key={p._id || index} className="flex flex-col items-center h-full justify-end flex-1 max-w-[100px] group relative">
                  
                  {/* Tooltip con el número exacto de clics al pasar el cursor */}
                  <div className="absolute -top-10 bg-[#12382F] text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                    {clics} clics
                  </div>

                  <span className="text-[10px] font-bold text-slate-600 mb-2">{clics}</span>

                  {/* Barra Vertical */}
                  <div 
                    className="w-full bg-[#17382D] hover:bg-[#234e40] rounded-t-xl transition-all duration-500 shadow-sm"
                    style={{ height: `${alturaPorcentaje}%` }}
                  ></div>

                  {/* Nombre de la propiedad debajo */}
                  <span className="text-[11px] font-bold text-[#12382F] mt-3 truncate w-full text-center" title={nombrePropiedad}>
                    {nombrePropiedad}
                  </span>
                </div>
              );
            })}

            {filteredProperties.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                No hay datos disponibles para graficar.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}