import React, { useState, useEffect } from 'react';

export default function Loader({ visible }) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setMounted(false), 650);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div className={`af-loader${!visible ? ' af-loader--out' : ''}`}>
      <div className="af-loader-logo">
        <span className="af-loader-word">AF</span>
        <span className="af-loader-dot">•</span>
        <span className="af-loader-word af-loader-word--light">SELECT</span>
      </div>
      <div className="af-loader-line" />
    </div>
  );
}
