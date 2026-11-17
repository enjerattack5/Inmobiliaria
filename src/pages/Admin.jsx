import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProperties from '../components/admin/AdminProperties';
import AdminConfig from '../components/admin/AdminConfig';
import AdminEstadisticas from '../components/admin/AdminEstadisticas';
import AdminLogin from '../components/admin/AdminLogin';
import TerrenoModal from '../components/admin/TerrenoModal';
import {
  obtenerPropiedades,
  crearPropiedad,
  haySesion,
  cerrarSesion,
  verificarSesion,
  EVENTO_SESION_EXPIRADA,
} from '../services/api';
import { MULTIMEDIA_VACIA, prepararMultimedia } from '../utils/multimedia';

const FORM_INICIAL = {
  nombre: '',
  tipoInmueble: 'Terreno',
  ciudad: '',
  entidad: '',
  direccion: '',
  superficie: '',
  precio: '',
  estado: 'Disponible',
  descripcion: '',
};

const TITULOS = {
  resumen: 'Resumen general',
  propiedades: 'Gestión de Propiedades',
  estadisticas: 'Estadísticas y Rendimiento',
  configuracion: 'Configuración del Negocio',
};

// Pestañas que muestran datos de las propiedades: se recargan al entrar para ver los clics más recientes
const PESTANAS_CON_DATOS = ['resumen', 'propiedades', 'estadisticas'];

function PanelAdmin({ onSalir }) {
  const [activeTab, setActiveTab] = useState('resumen');
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [media, setMedia] = useState(MULTIMEDIA_VACIA);
  const [guardando, setGuardando] = useState(false);

  const cargarPropiedades = useCallback(async () => {
    try {
      setProperties(await obtenerPropiedades());
    } catch (error) {
      console.error('No se pudieron cargar las propiedades:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarPropiedades();
  }, [cargarPropiedades]);

  // Si el token guardado ya venció, esto cierra la sesión y muestra el login
  useEffect(() => {
    verificarSesion().catch(() => {});
  }, []);

  const cambiarPestana = (pestana) => {
    setActiveTab(pestana);
    if (PESTANAS_CON_DATOS.includes(pestana)) cargarPropiedades();
  };

  const cambiarCampo = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setForm(FORM_INICIAL);
    setMedia(MULTIMEDIA_VACIA);
  };

  // Sube fotos, videos y PDF a Cloudinary y luego guarda la propiedad en MongoDB
  const guardarTerreno = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const { imagenes, videos, documentos } = await prepararMultimedia(media);

      await crearPropiedad({
        titulo: form.nombre,
        descripcion: form.descripcion.trim() || `${form.tipoInmueble} en venta con excelente ubicación`,
        precio: Number(form.precio),
        tipoOperacion: 'Venta',
        tipoInmueble: form.tipoInmueble,
        ubicacion: {
          direccion: form.direccion.trim() || `${form.ciudad.trim()}, ${form.entidad.trim()}`,
          ciudad: form.ciudad.trim(),
          estado: form.entidad.trim(),
        },
        caracteristicas: { superficieM2: Number(form.superficie) },
        estado: form.estado,
        imagenes,
        videos,
        documentos,
      });

      cerrarModal();
      cargarPropiedades();
    } catch (error) {
      console.error('Error al guardar la propiedad:', error);
      alert(`No se pudo guardar la propiedad:\n${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F1] text-[#12382F] flex font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={cambiarPestana} onSalir={onSalir} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Panel Administrativo</span>
            <h2 className="text-xl font-serif font-bold text-[#12382F] capitalize">{TITULOS[activeTab]}</h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#D8EF8B] hover:bg-[#c8e274] text-[#12382F] text-xs font-bold py-2.5 px-5 rounded-full transition-all shadow-sm flex items-center gap-2"
          >
            + Añadir propiedad
          </button>
        </header>

        <div className="p-8">
          {activeTab === 'resumen' && <AdminDashboard properties={properties} />}
          {activeTab === 'propiedades' && <AdminProperties properties={properties} onRefresh={cargarPropiedades} />}
          {activeTab === 'estadisticas' && <AdminEstadisticas properties={properties} />}
          {activeTab === 'configuracion' && <AdminConfig />}
        </div>
      </main>

      <TerrenoModal
        modalAbierto={isModalOpen}
        form={form}
        media={media}
        guardando={guardando}
        cambiarCampo={cambiarCampo}
        onMediaChange={setMedia}
        guardarTerreno={guardarTerreno}
        cerrarModal={cerrarModal}
      />
    </div>
  );
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(haySesion);

  // El servicio de API avisa cuando el servidor rechaza la sesión (venció o no es válida)
  useEffect(() => {
    const alExpirar = () => setAutenticado(false);
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  if (!autenticado) return <AdminLogin onLogin={() => setAutenticado(true)} />;

  return (
    <PanelAdmin
      onSalir={() => {
        cerrarSesion();
        setAutenticado(false);
      }}
    />
  );
}
