// ---Dependencies
import { useEffect } from 'react';
import { AppInfoStore, useAppInfoStore } from 'src/store/appInfo';
import { useWindowSize } from 'src/utils/hooks/useWindowSize';

export type ResponsiveData = Pick<AppInfoStore, 'isMobile' | 'winSize' | 'width'>;

/**
 * Hook para actualizar los puntos de interrupción de la pantalla en redux
 * con el tamaño de ventana actual usando un objeto ResponsiveData con
 * accesorios "isMovil" y "winSize"
 */
export function useScreenBreakpoints(): void {
  const { update } = useAppInfoStore();
  const { width } = useWindowSize();
  useEffect(() => updateScreen(), [width]);

  /** Calcula los puntos de interrupción de la pantalla y devuelve un objetoç
   *  ResponsiveData con propiedades "isMovil" y "winSize"
   * @returns {ResponsiveData}
   */
  function getScreen(): ResponsiveData {
    const caseXS = width < 576;
    const caseSM = width > 576 && width < 768;
    const caseMD = width > 768 && width < 992;
    const caseLG = width > 992 && width < 1200;
    const caseXL = width > 1200 && width < 1600;
    const caseXXL = width > 1600;
    if (caseXS) return { isMobile: true, winSize: 'xs', width };
    if (caseSM) return { isMobile: true, winSize: 'sm', width };
    if (caseMD) return { isMobile: false, winSize: 'md', width };
    if (caseLG) return { isMobile: false, winSize: 'lg', width };
    if (caseXL) return { isMobile: false, winSize: 'xl', width };
    if (caseXXL) return { isMobile: false, winSize: 'xxl', width };
    return { isMobile: false };
  }
  /** Actualiza la pantalla Breakpoints en redux */
  function updateScreen() {
    const newSize = getScreen();
    update({ ...newSize, clientLoaded: true });
  }
}
