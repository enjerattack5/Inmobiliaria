import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';
import { iniciarSesion } from '../../services/api';

export default function AdminLogin({ onLogin }) {
  const { config } = useConfig();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [entrando, setEntrando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setEntrando(true);
    try {
      await iniciarSesion(usuario, password);
      onLogin();
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setEntrando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#17382D] flex items-center justify-center p-6 font-sans">
      <form onSubmit={enviar} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Panel administrativo</span>
          <h1 className="text-xl font-serif font-bold text-[#12382F]">{config.nombreComercial}</h1>
          <p className="text-xs text-slate-500">Inicia sesión para continuar</p>
        </div>

        <label className="block">
          <span className="block text-xs font-bold text-[#12382F] mb-1.5">Usuario</span>
          <span className="relative block">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-600"
            />
          </span>
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-[#12382F] mb-1.5">Contraseña</span>
          <span className="relative block">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-600"
            />
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={entrando}
          className="w-full rounded-xl bg-[#D8EF8B] py-3.5 text-sm font-bold text-[#12382F] transition-colors hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>

        <a href="/" className="block text-center text-xs font-semibold text-slate-400 hover:text-[#12382F]">
          ← Volver al sitio
        </a>
      </form>
    </main>
  );
}
