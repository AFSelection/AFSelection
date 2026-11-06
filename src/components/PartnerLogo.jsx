import React from 'react';

/**
 * Logo de Cars & Cars que acompaña a AF Select.
 * Se pinta con el color del texto (currentColor) vía mask-image,
 * así funciona igual sobre fondo claro u oscuro.
 */
export default function PartnerLogo() {
  return (
    <>
      <span className="brand-partner-divider" aria-hidden="true" />
      <span className="brand-partner-logo" role="img" aria-label="Cars & Cars" />
    </>
  );
}
