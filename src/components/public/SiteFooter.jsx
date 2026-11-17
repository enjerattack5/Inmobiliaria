import { useConfig } from '../../hooks/useConfig';

export default function SiteFooter() {
  const { config } = useConfig();
  const nombre = config.nombreComercial.toUpperCase();

  return (
    <footer className="border-t border-[#17352b]/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-[#6d7d76] sm:flex-row">
        <span className="font-semibold text-[#17352b]">{nombre}</span>
        <span>
          © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
