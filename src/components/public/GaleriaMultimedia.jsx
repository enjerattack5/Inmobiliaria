import { useState } from 'react';

// Carrusel de fotos y videos de una propiedad
export default function GaleriaMultimedia({ imagenes = [], videos = [], titulo = 'Propiedad' }) {
  const elementos = [
    ...imagenes.map((url) => ({ tipo: 'imagen', url })),
    ...videos.map((url) => ({ tipo: 'video', url })),
  ];
  const [indice, setIndice] = useState(0);

  if (elementos.length === 0) return null;

  const total = elementos.length;
  const actual = elementos[indice];
  const siguiente = () => setIndice((i) => (i + 1) % total);
  const anterior = () => setIndice((i) => (i - 1 + total) % total);

  return (
    <div className="relative h-64 w-full bg-[#0b211a] sm:h-80">
      {actual.tipo === 'imagen' ? (
        <img src={actual.url} alt={`Vista de ${titulo}`} className="h-full w-full object-cover" />
      ) : (
        <video src={actual.url} controls className="h-full w-full object-contain" />
      )}

      {total > 1 && (
        <>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {indice + 1} / {total}
          </span>
          <button
            type="button"
            onClick={anterior}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-xl shadow-md transition hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={siguiente}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-xl shadow-md transition hover:bg-white"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
