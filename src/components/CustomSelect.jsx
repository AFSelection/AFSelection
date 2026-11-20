import React, { useEffect, useId, useRef, useState } from 'react';

/**
 * Selector propio, en lugar del <select> nativo (que en cada sistema operativo
 * se abre con un menú distinto y no respeta el diseño del sitio).
 *
 * - El botón recibe la misma clase que tenía el <select> (`className`), así
 *   mantiene el aspecto del formulario donde está.
 * - Teclado: ↑ ↓ Inicio Fin para moverse, Enter/Espacio elige, Esc cierra.
 * - Lectores de pantalla: patrón combobox + listbox (WAI-ARIA).
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  className = '',
  dark = false,
  ariaLabel,
  id
}) {
  const autoId = useId();
  const baseId = id || `cselect-${autoId}`;
  const listId = `${baseId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const items = options.map((o) => (typeof o === 'object' ? o : { value: String(o), label: String(o) }));
  const selectedIndex = Math.max(0, items.findIndex((o) => o.value === value));
  const selected = items[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (i) => {
    const item = items[i];
    if (item && item.value !== value) onChange(item.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(items.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(items.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'Tab') { setOpen(false); }
  };

  return (
    <div ref={rootRef} className={`cselect${dark ? ' cselect--dark' : ''}${open ? ' is-open' : ''}`}>
      <button
        ref={buttonRef}
        id={baseId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        aria-label={ariaLabel}
        className={`cselect-trigger ${className}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="cselect-value">{selected?.label}</span>
      </button>

      {open && (
        <ul id={listId} role="listbox" className="cselect-list" aria-labelledby={baseId}>
          {items.map((item, i) => (
            <li
              key={item.value}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={`cselect-option${i === active ? ' is-active' : ''}${i === selectedIndex ? ' is-selected' : ''}`}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              <span>{item.label}</span>
              {i === selectedIndex && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
