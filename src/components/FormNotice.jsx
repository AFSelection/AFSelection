import React from 'react';

/**
 * Aviso dentro del formulario (faltan datos, falló el envío).
 *
 * Reemplaza a los `alert()` nativos: esos cortan la página con una ventana
 * del navegador y en celular se ven como un error del sistema. Este queda
 * junto al botón, lo anuncian los lectores de pantalla (role="alert") y
 * desaparece solo cuando se vuelve a intentar.
 */
export default function FormNotice({ message }) {
  if (!message) return null;
  return (
    <p className="form-notice" role="alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.75v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.9" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </p>
  );
}
