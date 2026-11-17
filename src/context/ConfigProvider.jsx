import { useState, useEffect, useCallback, useMemo } from 'react';
import { ConfigContext, CONFIG_POR_DEFECTO } from './ConfigContext';
import { obtenerConfiguracion } from '../services/api';

export default function ConfigProvider({ children }) {
  const [config, setConfig] = useState(CONFIG_POR_DEFECTO);
  const [cargando, setCargando] = useState(true);

  const recargarConfig = useCallback(async () => {
    try {
      const datos = await obtenerConfiguracion();
      setConfig({ ...CONFIG_POR_DEFECTO, ...datos });
    } catch (error) {
      console.error('No se pudo cargar la configuración, se usan valores por defecto:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    recargarConfig();
  }, [recargarConfig]);

  const valor = useMemo(() => ({ config, cargando, recargarConfig }), [config, cargando, recargarConfig]);

  return <ConfigContext.Provider value={valor}>{children}</ConfigContext.Provider>;
}
