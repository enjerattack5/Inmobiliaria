import { useState, useEffect } from 'react';
import { obtenerPropiedades } from '../services/api';
import { normalizarPropiedad, esPublica } from '../utils/propiedades';

// Carga las propiedades publicadas desde el backend (MongoDB)
export function usePropiedades() {
  const [estado, setEstado] = useState({ propiedades: [], cargando: true, error: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    obtenerPropiedades()
      .then((datos) => {
        if (cancelado) return;
        setEstado({ propiedades: datos.map(normalizarPropiedad).filter(esPublica), cargando: false, error: null });
      })
      .catch((error) => {
        if (cancelado) return;
        console.error('No se pudieron cargar las propiedades:', error);
        setEstado({ propiedades: [], cargando: false, error: error.message });
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = () => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));
    setIntento((n) => n + 1);
  };

  return { ...estado, reintentar };
}
