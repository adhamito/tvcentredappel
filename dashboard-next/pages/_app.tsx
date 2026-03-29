import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState, createContext } from "react";

export const ZoomContext = createContext<number>(1);

export default function App({ Component, pageProps }: AppProps) {
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleZoomDetection = () => {
      // Calculate the current browser zoom level
      const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Determine an effective zoom ratio based on the lower of the two
      const effectiveZoom = Math.min(zoomLevel, pixelRatio);
      
      // If the user zooms out significantly (e.g. 50%), apply a counter-scale
      if (effectiveZoom <= 0.65) {
        document.documentElement.classList.add('zoom-scaled');
        // Calculate counter-scale to bring it back to roughly 100% equivalent visual size
        const factor = 1 / effectiveZoom;
        document.body.style.setProperty('--scale-factor', factor.toFixed(2));
        setScaleFactor(factor);
      } else {
        document.documentElement.classList.remove('zoom-scaled');
        document.body.style.setProperty('--scale-factor', '1');
        setScaleFactor(1);
      }
    };

    window.addEventListener('resize', handleZoomDetection);
    // Initial check
    handleZoomDetection();

    return () => window.removeEventListener('resize', handleZoomDetection);
  }, []);

  return (
    <ZoomContext.Provider value={scaleFactor}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5" />
      </Head>
      <Component {...pageProps} />
    </ZoomContext.Provider>
  );
}
