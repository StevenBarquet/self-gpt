import type React from 'react';
import { useEffect, useState } from 'react';

/** Devuelve el ancho en tiempo real de un elemento recibiendo un ref */
export function useResizeObserver<T extends Element>(ref: React.RefObject<T>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };

    update(); // primera medición

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref]);

  return size;
}
