import React, { useState, useEffect, useRef } from 'react';
import { resolveImageUrl, preloadImage, isImageReady } from '../utils/imageUrl';

/**
 * Imagen que no parpadea, no se pinta en cortina y no se queda en negro.
 *
 * Regla central: el `<img>` sólo recibe una URL que ya fue descargada Y
 * decodificada. Nunca le pasamos una URL "en camino".
 *
 * De ahí salen las tres garantías:
 *  - No hay cortina, porque el navegador no decodifica al pintar.
 *  - No hay negro, porque no dependemos de que llegue un evento `onLoad` para
 *    quitar una opacidad 0 (que era exactamente el bug: si la imagen ya estaba
 *    en caché, React se perdía el `load` y la opacidad quedaba en 0 para siempre).
 *  - No hay salto al cambiar de foto: mientras la nueva se prepara seguimos
 *    mostrando la anterior, y recién ahí cambiamos.
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  style = {},
  width,
  height,
  targetWidth = 800,
  targetHeight,
  quality = 72,
  resize,
  priority = false,
  onClick,
  ...props
}) {
  const finalSrc = src
    ? resolveImageUrl(src, { width: targetWidth, height: targetHeight, quality, resize })
    : null;

  // Lo que está realmente pintado. Arranca ya resuelto si la imagen estaba
  // lista, así el primer render no pasa por el skeleton.
  const [shownSrc, setShownSrc] = useState(() =>
    finalSrc && isImageReady(finalSrc) ? finalSrc : null
  );
  const [failed, setFailed] = useState(false);

  // Para ignorar respuestas de una imagen que ya no corresponde (el usuario
  // pasó a otra foto mientras esta bajaba).
  const wantedRef = useRef(finalSrc);

  useEffect(() => {
    wantedRef.current = finalSrc;

    if (!finalSrc) {
      setShownSrc(null);
      setFailed(false);
      return;
    }

    if (isImageReady(finalSrc)) {
      setShownSrc(finalSrc);
      setFailed(false);
      return;
    }

    // Ojo: NO limpiamos `shownSrc` acá. Dejar la foto anterior en pantalla
    // mientras baja la nueva es lo que elimina el flash negro al hacer hover
    // sobre una tarjeta o al tocar una miniatura de la galería.
    setFailed(false);

    let alive = true;
    preloadImage(finalSrc).then((ok) => {
      if (!alive || wantedRef.current !== finalSrc) return;
      if (ok) setShownSrc(finalSrc);
      else setFailed(true);
    });

    return () => { alive = false; };
  }, [finalSrc]);

  const hasImage = !!shownSrc;

  const boxStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : '100%',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  return (
    <div
      className={`img-box ${hasImage ? 'is-loaded' : 'is-pending'} ${failed ? 'is-failed' : ''}`}
      style={boxStyle}
    >
      {hasImage && (
        <img
          src={shownSrc}
          alt={alt}
          className={`img-media ${className}`}
          // Siempre eager, a propósito. La imagen ya está descargada y
          // decodificada antes de llegar acá, así que `lazy` no ahorraría una
          // sola descarga: lo único que haría es diferir el pintado de algo que
          // ya está listo, y volver a producir el efecto de aparición por partes.
          loading="eager"
          decoding="sync"
          fetchpriority={priority ? 'high' : 'auto'}
          draggable={false}
          onClick={onClick}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          {...props}
        />
      )}
    </div>
  );
}
