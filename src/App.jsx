import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Admin from './pages/Admin';
import ConfigProvider from './context/ConfigProvider';

function elegirPagina() {
  const ruta = window.location.pathname.replace(/\/+$/, '') || '/';
  if (ruta.startsWith('/admin')) return <Admin />;
  if (ruta === '/catalogo') return <Catalogo />;
  return <Home />;
}

export default function App() {
  // Ruteo simple: /admin (panel), /catalogo (catálogo con filtros) y cualquier otra ruta (inicio)
  return <ConfigProvider>{elegirPagina()}</ConfigProvider>;
}
