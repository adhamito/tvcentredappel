import { useEffect, useState } from 'react';

export function useZoom() {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const calculateZoom = () => {
      // innerWidth is the layout viewport width
      // outerWidth is the browser window width
      // When zoomed out to 50%, innerWidth is 2x outerWidth
      if (typeof window !== 'undefined' && window.outerWidth > 0) {
        // Fallback for visualViewport if available, otherwise calculate ratio
        let ratio = 1;
        if (window.visualViewport) {
            ratio = window.visualViewport.scale;
        } else {
            ratio = window.outerWidth / window.innerWidth;
        }
        
        // At 50% zoom, ratio is 0.5 or innerWidth is 2x outerWidth
        // Depending on browser, window.devicePixelRatio or outerWidth/innerWidth works
        const pixelRatio = window.devicePixelRatio || 1;
        
        // We use either the visualViewport scale or the pixelRatio to estimate zoom
        const effectiveZoom = ratio !== 1 ? ratio : pixelRatio;
        
        setZoomLevel(effectiveZoom);
        
        // If zoom is <= 0.6 (e.g., 50%), apply scaling class
        if (effectiveZoom <= 0.6) {
          document.documentElement.classList.add('zoom-50-applied');
        } else {
          document.documentElement.classList.remove('zoom-50-applied');
        }
      }
    };

    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    // visualViewport resize event is more accurate for zoom
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', calculateZoom);
    }
    
    return () => {
      window.removeEventListener('resize', calculateZoom);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', calculateZoom);
      }
    };
  }, []);

  return zoomLevel;
}
