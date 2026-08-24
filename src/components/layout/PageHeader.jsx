/**
 * Ruta: src/components/layout/PageHeader.jsx
 * Resumen: Header reutilizable para páginas internas (Fixture, Noticias, etc.),
 *          con la identidad visual del club (verde + franjas tipo camiseta).
 * Lógica: Banner sólido en --color-verde con un eyebrow opcional, título en
 *         font-display, y un slot `action` a la derecha para meta info o
 *         botones. Las franjas diagonales son puramente decorativas
 *         (aria-hidden) y no interfieren con el contenido ni la accesibilidad.
 * Debería: Dar consistencia visual a todas las páginas internas sin repetir
 *         markup, funcionando bien apilado en mobile y en fila en desktop.
 */
export default function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="relative mb-8 md:mb-12 overflow-hidden rounded-2xl bg-verde px-6 py-8 md:px-10 md:py-12">
      {/* Franjas diagonales — motivo de camiseta de rugby/hockey, decorativo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-4 top-0 h-full w-20 rotate-12 bg-verde-claro" />
        <div className="absolute right-14 top-0 h-full w-8 rotate-12 bg-white" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-verde-claro">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl text-white md:text-6xl">{title}</h1>
        </div>
        {action && <div className="shrink-0 text-white/80 text-sm">{action}</div>}
      </div>
    </div>
  );
}