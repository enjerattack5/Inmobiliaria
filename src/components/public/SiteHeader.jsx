import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import logoPorDefecto from '../../assets/logo-ramirez.png';

const ENLACES = [
  { href: '/#terrenos', texto: 'Destacados' },
  { href: '/catalogo', texto: 'Catálogo' },
  { href: '/#nosotros', texto: 'Nosotros' },
  { href: '/#proceso', texto: 'Cómo comprar' },
];

// solid = true en el catálogo (fondo verde); en el inicio flota sobre la imagen principal
export default function SiteHeader({ solid = false }) {
  const { config } = useConfig();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className={solid ? 'relative z-30 bg-[#17352b]' : 'absolute inset-x-0 top-0 z-30'}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="flex items-center gap-3 text-white">
          <img
            src={config.logo || logoPorDefecto}
            alt={`Logo de ${config.nombreComercial}`}
            className="h-20 w-20 rounded-full object-contain"
          />
          <span className="text-xl font-semibold tracking-tight">{config.nombreComercial.toUpperCase()}</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-white/85 md:flex">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} className="transition hover:text-white" href={enlace.href}>
              {enlace.texto}
            </a>
          ))}
          <a
            href="/#contacto"
            className="rounded-full bg-[#d8ed8d] px-5 py-2.5 font-semibold text-[#17352b] transition hover:bg-white"
          >
            Hablar con un asesor
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white md:hidden"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
        >
          <span className="text-xl leading-none">{menuAbierto ? '×' : '≡'}</span>
        </button>
      </div>

      {menuAbierto && (
        <nav className="mx-5 flex flex-col gap-4 rounded-2xl bg-white p-5 text-sm font-medium text-[#17352b] shadow-xl md:hidden">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} href={enlace.href} onClick={() => setMenuAbierto(false)}>
              {enlace.texto}
            </a>
          ))}
          <a href="/#contacto" onClick={() => setMenuAbierto(false)}>
            Contactar asesor
          </a>
        </nav>
      )}
    </header>
  );
}
