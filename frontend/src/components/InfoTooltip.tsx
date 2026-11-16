import { useEffect, useId, useRef, useState } from 'react'

interface InfoTooltipProps {
  label: string
  text: string
}

/** "?" button that reveals `text` on hover, keyboard focus or tap. Escape closes it. */
export function InfoTooltip({ label, text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    // Tapping anywhere else closes it on touch devices.
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <span
      ref={rootRef}
      className="tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="tooltip__trigger"
        aria-label={`About ${label}`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        ?
      </button>
      {open && (
        <span id={id} role="tooltip" className="tooltip__bubble">
          {text}
        </span>
      )}
    </span>
  )
}
