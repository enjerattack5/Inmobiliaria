import { useState, useEffect, useMemo } from 'react';
import SiteHeader from '../components/public/SiteHeader';
import SiteFooter from '../components/public/SiteFooter';
import CatalogFilters from '../components/public/CatalogFilters';
import PropertyCard, { PropertyCardSkeleton } from '../components/public/PropertyCard';
import PropertyModal from '../components/public/PropertyModal';
import { usePropiedades } from '../hooks/usePropiedades';
import { registrarClic } from '../services/api';
import {
  FILTROS_INICIALES,
  filtrarPropiedades,
  filtrosAURL,
  hayFiltrosActivos,
  leerFiltrosDeURL,
  opcionesUbicacion,
} from '../utils/propiedades';

export default function Catalogo() {
  const { propiedades, cargando, error, reintentar } = usePropiedades();
  const [filtros, setFiltros] = useState(() => leerFiltrosDeURL(window.location.search));
  const [seleccionada, setSeleccionada] = useState(null);

  // Mantiene los filtros en la URL para poder compartir la búsqueda
  useEffect(() => {
    window.history.replaceState(null, '', `/catalogo${filtrosAURL(filtros)}`);
  }, [filtros]);

  const ubicaciones = useMemo(() => opcionesUbicacion(propiedades), [propiedades]);

  // Si la URL trae una ubicación que ya no existe, no se aplica
  const filtrosEfectivos = useMemo(
    () => ({ ...filtros, ubicacion: ubicaciones.includes(filtros.ubicacion) ? filtros.ubicacion : '' }),
    [filtros, ubicaciones]
  );

  const resultados = useMemo(() => filtrarPropiedades(propiedades, filtrosEfectivos), [propiedades, filtrosEfectivos]);
  const hayFiltros = hayFiltrosActivos(filtrosEfectivos);
  const total = resultados.length;

  // Al abrir una propiedad se suma un clic (se ve en las estadísticas del admin)
  const abrirPropiedad = (propiedad) => {
    setSeleccionada(propiedad);
    registrarClic(propiedad.id);
  };

  const cambiarFiltro = (campo, valor) => setFiltros((previo) => ({ ...previo, [campo]: valor }));
  const limpiarFiltros = () => setFiltros({ ...FILTROS_INICIALES, orden: filtros.orden });

  const titulo = cargando
    ? 'Cargando terrenos...'
    : `${total} ${total === 1 ? 'propiedad' : 'propiedades'} ${hayFiltros ? (total === 1 ? 'encontrada' : 'encontradas') : total === 1 ? 'disponible' : 'disponibles'}`;

  return (
    <main className="min-h-screen bg-[#f7f6f1] font-dm text-[#17352b]">
      <SiteHeader solid />

      <section id="catalogo" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#718b2c]">Catálogo completo</p>
              <h2 className="font-display text-4xl text-[#17352b] sm:text-5xl">{titulo}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6d7d76]">
                Usa los filtros para encontrar lo que buscas (terreno, casa o departamento) y selecciona cualquier
                propiedad para conocer sus características.
              </p>
            </div>
            {!cargando && !error && (
              <span className="w-fit rounded-full bg-[#e8f2c4] px-4 py-2 text-sm font-bold">
                {total} {total === 1 ? 'propiedad' : 'propiedades'}
              </span>
            )}
          </div>

          <CatalogFilters
            filtros={filtrosEfectivos}
            ubicaciones={ubicaciones}
            onChange={cambiarFiltro}
            onLimpiar={limpiarFiltros}
            hayFiltros={hayFiltros}
          />

          {cargando && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, n) => (
                <PropertyCardSkeleton key={n} />
              ))}
            </div>
          )}

          {!cargando && error && (
            <div className="rounded-2xl bg-[#f7f6f1] p-10 text-center">
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

          {!cargando && !error && total === 0 && (
            <div className="rounded-2xl bg-[#f7f6f1] p-10 text-center">
              {propiedades.length === 0 ? (
                <p className="text-sm text-[#6d7d76]">Todavía no hay propiedades publicadas. ¡Vuelve pronto!</p>
              ) : (
                <>
                  <p className="font-semibold">No encontramos propiedades con esos filtros.</p>
                  <p className="mt-1 text-sm text-[#6d7d76]">Prueba con otro tipo, presupuesto o ubicación.</p>
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="mt-5 rounded-full bg-[#d8ed8d] px-6 py-2.5 text-sm font-semibold transition hover:bg-[#c8e274]"
                  >
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
          )}

          {!cargando && !error && total > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {resultados.map((p) => (
                <PropertyCard key={p.id} propiedad={p} onClick={() => abrirPropiedad(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {seleccionada && <PropertyModal propiedad={seleccionada} onClose={() => setSeleccionada(null)} />}

      <SiteFooter />
    </main>
  );
}
