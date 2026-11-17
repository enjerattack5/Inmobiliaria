import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { guardarConfiguracion, subirArchivos } from '../../services/api';

const claseInput =
  'w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#17382D] font-medium text-slate-700';

function FormularioConfig({ inicial, onGuardado }) {
  const [form, setForm] = useState(inicial);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cambiarCampo = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Sube el logo a Cloudinary y lo deja en el formulario (se guarda al presionar "Guardar")
  const cambiarLogo = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    setSubiendoLogo(true);
    try {
      const { imagenes } = await subirArchivos([archivo]);
      if (!imagenes?.[0]) throw new Error('El archivo debe ser una imagen (PNG, JPG, WEBP o SVG)');
      setForm((prev) => ({ ...prev, logo: imagenes[0] }));
    } catch (error) {
      console.error('Error al subir el logotipo:', error);
      alert(`No se pudo subir el logotipo:\n${error.message}`);
    } finally {
      setSubiendoLogo(false);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await guardarConfiguracion(form);
      await onGuardado();
      alert('¡Configuración guardada! Ya se ve reflejada en el sitio público.');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      alert(`No se pudo guardar la configuración:\n${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={guardar} className="space-y-6 text-xs">
      {/* Logotipo */}
      <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        {form.logo ? (
          <img src={form.logo} alt="Logotipo" className="w-16 h-16 rounded-2xl object-contain bg-white border border-slate-200 shadow-sm" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-[#17382D] flex items-center justify-center text-[#D8EF8B] font-serif font-bold text-xl shadow-sm">
            {(form.nombreComercial || 'R').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="space-y-1 flex-1">
          <span className="font-bold text-[#12382F] block">Logotipo</span>
          <p className="text-[11px] text-slate-400">PNG, JPG o WEBP, de preferencia con fondo transparente</p>
        </div>
        <div className="flex items-center gap-2">
          {form.logo && (
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, logo: '' }))}
              className="px-3 py-2.5 rounded-xl font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Quitar
            </button>
          )}
          <label
            className={`px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer ${
              subiendoLogo ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {subiendoLogo ? 'Subiendo...' : 'Cambiar archivo'}
            <input type="file" accept="image/*" onChange={cambiarLogo} className="hidden" />
          </label>
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#12382F] mb-2">Nombre comercial</label>
        <input type="text" name="nombreComercial" required value={form.nombreComercial} onChange={cambiarCampo} className={claseInput} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold text-[#12382F] mb-2">Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={cambiarCampo} className={claseInput} />
        </div>
        <div>
          <label className="block font-bold text-[#12382F] mb-2">WhatsApp</label>
          <input type="text" name="whatsapp" value={form.whatsapp} onChange={cambiarCampo} placeholder="10 dígitos, ej. 9617522184" className={claseInput} />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#12382F] mb-2">Correo electrónico</label>
        <input type="email" name="correo" value={form.correo} onChange={cambiarCampo} className={claseInput} />
      </div>

      <div>
        <label className="block font-bold text-[#12382F] mb-2">Horario de atención</label>
        <input type="text" name="horario" value={form.horario} onChange={cambiarCampo} className={claseInput} />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={guardando || subiendoLogo}
          className="px-8 py-3.5 rounded-xl font-bold text-[#12382F] bg-[#D8EF8B] hover:bg-lime-300 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {guardando ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </form>
  );
}

export default function AdminConfig() {
  const { config, cargando, recargarConfig } = useConfig();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Información pública</span>
          <h3 className="text-lg font-serif font-bold text-[#12382F]">Datos del negocio</h3>
          <p className="text-xs text-slate-500 mt-1">Estos datos aparecerán en el sitio público de la inmobiliaria.</p>
        </div>

        {cargando ? (
          <p className="text-xs text-slate-400">Cargando configuración...</p>
        ) : (
          <FormularioConfig inicial={config} onGuardado={recargarConfig} />
        )}
      </div>
    </div>
  );
}
