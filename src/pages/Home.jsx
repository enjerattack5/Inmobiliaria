import { useState, useEffect } from 'react';
import SiteHeader from '../components/public/SiteHeader';
import SiteFooter from '../components/public/SiteFooter';
import Icon from '../components/public/Icon';
import PropertyCard, { PropertyCardSkeleton } from '../components/public/PropertyCard';
import PropertyModal from '../components/public/PropertyModal';
import whatsappIcono from '../assets/whatsapp.png';
import heroImg from '../assets/hero.jpg';
import { useConfig } from '../hooks/useConfig';
import { usePropiedades } from '../hooks/usePropiedades';
import { linkWhatsApp, linkTelefono, linkCorreo } from '../utils/contacto';
import { registrarClic } from '../services/api';
import { RANGOS_PRECIO, TIPOS, FILTROS_INICIALES, filtrosAURL, opcionesUbicacion } from '../utils/propiedades';

const VENTAJAS = [
  ['shield', 'Certeza jurídica', 'Verificamos la documentación y el historial de cada propiedad.'],
  ['map', 'Ubicaciones con futuro', 'Seleccionamos zonas con conectividad, crecimiento y plusvalía.'],
  ['check', 'Asesoría personal', 'Te acompañamos desde la visita hasta la entrega de escrituras.'],
  ['ruler', 'Opciones a tu medida', 'Encuentra extensiones y esquemas de pago para cada proyecto.'],
];

export default function Home() {
  const { config } = useConfig();
  const { propiedades, cargando, error, reintentar } = usePropiedades();
  const [seleccionada, setSeleccionada] = useState(null);
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('');

  // Si se entra con /#contacto (desde el catálogo), baja a esa sección
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0);
  }, []);

  // Destacados: las 3 propiedades disponibles más recientes
  const disponibles = propiedades.filter((p) => p.situacion === 'Disponible');
  const destacadas = (disponibles.length > 0 ? disponibles : propiedades).slice(0, 3);

  // Al abrir una propiedad se suma un clic (se ve en las estadísticas del admin)
  const abrirPropiedad = (propiedad) => {
    setSeleccionada(propiedad);
    registrarClic(propiedad.id);
  };

  const buscar = () => {
    window.location.href = `/catalogo${filtrosAURL({ ...FILTROS_INICIALES, ubicacion, precio, tipo })}`;
  };

  const contactos = [
    {
      clave: 'whatsapp',
      etiqueta: 'WhatsApp',
      valor: config.whatsapp,
      href: linkWhatsApp(config.whatsapp, 'Hola, me gustaría recibir información sobre sus terrenos'),
      icono: <img src={whatsappIcono} alt="" className="h-6 w-6" />,
    },
    config.correo && {
      clave: 'correo',
      etiqueta: 'Escríbenos',
      valor: config.correo,
      href: linkCorreo(config.correo, 'Información sobre terrenos'),
      icono: <Icon name="mail" />,
    },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f7f6f1] font-dm text-[#17352b]">
      <SiteHeader />

      {/* Portada con buscador */}
      <section className="relative flex min-h-[780px] items-end overflow-hidden pb-16 pt-32 lg:min-h-[820px] lg:items-center lg:pb-0">
        <img src={heroImg} alt="Amplio terreno verde" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,40,31,.86)_0%,rgba(12,40,31,.52)_48%,rgba(12,40,31,.12)_100%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#d8ed8d]">
              <span className="h-px w-10 bg-[#d8ed8d]" />
              Patrimonio que crece contigo
            </p>
            <h1 className="max-w-2xl font-display text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Tu lugar en el mundo empieza aquí.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Terrenos, casas y departamentos seleccionados en zonas con alto potencial, certeza jurídica y
              acompañamiento experto de principio a fin.
            </p>
          </div>

          <div className="mt-10 grid max-w-4xl gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="border-b border-[#17352b]/10 px-4 py-2 sm:border-b-0 sm:border-r">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#6d7d76]">Tipo</span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
              >
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id === '' ? 'Cualquier tipo' : t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="border-b border-[#17352b]/10 px-4 py-2 sm:border-b-0 sm:border-r">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#6d7d76]">Ubicación</span>
              <select
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
              >
                <option value="">Todas las ubicaciones</option>
                {opcionesUbicacion(propiedades).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
            <label className="px-4 py-2">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#6d7d76]">Presupuesto</span>
              <select
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
              >
                {RANGOS_PRECIO.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={buscar}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#17352b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#285545]"
            >
              Buscar propiedades <Icon name="arrow" />
            </button>
          </div>
        </div>
      </section>

      {/* Terrenos destacados (vienen de MongoDB) */}
      <section id="terrenos" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#718b2c]">Oportunidades destacadas</p>
            <h2 className="font-display text-4xl text-[#17352b] sm:text-5xl">Elige dónde echar raíces</h2>
          </div>
          <a href="/catalogo" className="flex items-center gap-2 text-sm font-bold">
            Ver todo el catálogo <Icon name="arrow" />
          </a>
        </div>

        {cargando && (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <PropertyCardSkeleton key={n} variante="destacada" />
            ))}
          </div>
        )}

        {!cargando && error && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold">No pudimos cargar las propiedades en este momento.</p>
            <p className="mt-1 text-sm text-[#6d7d76]">Revisa tu conexión e inténtalo de nuevo.</p>
            <button
              type="button"
              onClick={reintentar}
              className="mt-5 rounded-full bg-[#17352b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285545]"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && destacadas.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#6d7d76] shadow-sm">
            Muy pronto publicaremos nuevas propiedades. ¡Vuelve a visitarnos!
          </div>
        )}

        {!cargando && !error && destacadas.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {destacadas.map((p) => (
              <PropertyCard key={p.id} propiedad={p} variante="destacada" onClick={() => abrirPropiedad(p)} />
            ))}
          </div>
        )}
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-[#17352b] text-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d8ed8d]">Compra con confianza</p>
            <h2 className="max-w-lg font-display text-4xl leading-tight sm:text-5xl">
              Una propiedad segura. Una decisión que trasciende.
            </h2>
          </div>
          <div id="proceso" className="grid gap-8 sm:grid-cols-2">
            {VENTAJAS.map(([icono, titulo, texto]) => (
              <div key={titulo}>
                <Icon name={icono} className="mb-4 h-7 w-7 text-[#d8ed8d]" />
                <h3 className="font-semibold">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto (datos tomados de Configuración en el admin) */}
      <section id="contacto" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="overflow-hidden rounded-[28px] bg-[#d8ed8d]">
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em]">Hablemos</p>
              <h2 className="mt-4 max-w-md font-display text-4xl leading-tight sm:text-5xl">
                Da el primer paso hacia tu propiedad
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#17352b]/70">
                Cuéntanos qué estás buscando. Un asesor especializado se pondrá en contacto contigo para mostrarte las
                mejores opciones.
              </p>
              <div className="mt-10 space-y-5">
                {contactos.map((c) => (
                  <a
                    key={c.clave}
                    href={c.href}
                    target={c.clave === 'whatsapp' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-4 transition hover:translate-x-1"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/65">{c.icono}</span>
                    <span>
                      <span className="block text-xs text-[#17352b]/60">{c.etiqueta}</span>
                      <span className="font-semibold">{c.valor}</span>
                    </span>
                  </a>
                ))}
                {config.horario && (
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/65">
                      <Icon name="clock" />
                    </span>
                    <span>
                      <span className="block text-xs text-[#17352b]/60">Horario de atención</span>
                      <span className="font-semibold">{config.horario}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center bg-white p-8 sm:p-12 lg:p-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#718b2c]">Atención personalizada</p>
                <h3 className="mt-4 max-w-md font-display text-3xl sm:text-4xl">
                  Visita la propiedad que más te interesa
                </h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#6d7d76]">
                  Agenda un recorrido sin compromiso. Te acompañamos en la visita y resolvemos todas tus dudas sobre
                  documentación, servicios y formas de pago.
                </p>
                <a
                  href={linkTelefono(config.telefono)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17352b] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#285545]"
                >
                  <Icon name="phone" /> Agendar una visita
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {seleccionada && <PropertyModal propiedad={seleccionada} onClose={() => setSeleccionada(null)} />}

      <SiteFooter />
    </main>
  );
}
