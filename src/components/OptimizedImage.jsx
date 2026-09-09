import React, { useState, useEffect } from 'react';

/**
 * Optimizes image URLs by adding dimensions and quality parameters for Unsplash & Supabase.
 */
export function getOptimizedImageUrl(url, width = 800) {
  if (!url || typeof url !== 'string') return url;

  // Unsplash CDN optimization
  if (url.includes('images.unsplash.com')) {
    const hasParams = url.includes('?');
    const baseUrl = hasParams ? url.split('?')[0] : url;
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
  }

  return url;
}

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  style = {},
  width,
  height,
  priority = false,
  targetWidth = 800,
  onClick,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, targetWidth);

  useEffect(() => {
    setLoaded(false);
    setError(false);

    if (!src) return;

    // Check if cached
    const img = new Image();
    img.src = optimizedSrc;
    if (img.complete) {
      setLoaded(true);
    }
  }, [src, optimizedSrc]);

  return (
    <div
      className={`img-skeleton-box ${loaded ? 'is-loaded' : ''}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        className={`img-smooth-load ${loaded ? 'loaded' : ''} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          ...style
        }}
        {...props}
      />
    </div>
  );
}
