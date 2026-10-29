import { useEffect, useRef, useState } from 'react'
import { MESES_CORTOS, formatearMes, formatearMesCorto } from '../../lib/inflacion'


const Chevron = ({ className }) => (
  <svg className={className} viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
    <path fillRule='evenodd' d='M7.2 14.8a.75.75 0 0 1 0-1.06L10.94 10 7.2 6.26a.75.75 0 1 1 1.06-1.06l4.27 4.27a.75.75 0 0 1 0 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0Z' clipRule='evenodd' />
  </svg>
)

const Calendario = () => (
  <svg className='hidden size-4 shrink-0 text-accent sm:block' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <rect x='3' y='5' width='18' height='16' rx='2' />
    <path d='M16 3v4M8 3v4M3 10h18' />
  </svg>
)

// Selector de mes: primero se navega el año y después se elige el mes en una grilla.
// `periodos` son los meses habilitados ("AAAA-MM"); `rango` resalta el período desde/hasta.
const MonthPicker = ({ id, label, value, onChange, periodos, rango = [], disabled, alinear = 'izquierda' }) => {
  const [abierto, setAbierto] = useState(false)
  const [anio, setAnio] = useState(() => Number(value.slice(0, 4)))
  const contenedorRef = useRef(null)
  const botonRef = useRef(null)
  const panelRef = useRef(null)

  const habilitados = new Set(periodos)
  const anios = periodos.map(p => Number(p.slice(0, 4)))
  const anioMin = Math.min(...anios)
  const anioMax = Math.max(...anios)
  const [inicioRango, finRango] = rango

  const cerrar = (devolverFoco = false) => {
    setAbierto(false)
    if (devolverFoco) botonRef.current?.focus()
  }

  const abrir = () => {
    setAnio(Number(value.slice(0, 4)))
    setAbierto(true)
  }

  // Cerrar al tocar afuera o con Escape
  useEffect(() => {
    if (!abierto) return
    const alTocarAfuera = (evt) => {
      if (!contenedorRef.current?.contains(evt.target)) cerrar()
    }
    const alApretarTecla = (evt) => {
      if (evt.key === 'Escape') cerrar(true)
    }
    document.addEventListener('pointerdown', alTocarAfuera)
    document.addEventListener('keydown', alApretarTecla)
    return () => {
      document.removeEventListener('pointerdown', alTocarAfuera)
      document.removeEventListener('keydown', alApretarTecla)
    }
  }, [abierto])

  // Al abrir, enfocar el mes elegido (o el primero disponible)
  useEffect(() => {
    if (!abierto) return
    const panel = panelRef.current
    const destino = panel?.querySelector('[aria-pressed="true"]') ?? panel?.querySelector('[data-mes]:not(:disabled)')
    destino?.focus()
  }, [abierto])

  const elegir = (periodo) => {
    onChange(periodo)
    cerrar(true)
  }

  return (
    <div className='relative flex flex-col gap-1' ref={contenedorRef}>
      <label htmlFor={id} className='text-xs font-medium text-muted'>{label}</label>
      <button
        id={id}
        ref={botonRef}
        type='button'
        onClick={() => (abierto ? cerrar() : abrir())}
        disabled={disabled || !value}
        aria-haspopup='dialog'
        aria-expanded={abierto}
        className='field flex items-center gap-2 text-left'
      >
        <Calendario />
        <span className='flex-1 truncate font-medium'>{value ? formatearMesCorto(value) : 'Cargando…'}</span>
        <Chevron className={`size-4 shrink-0 text-muted transition-transform ${abierto ? '-rotate-90' : 'rotate-90'}`} />
      </button>

      {abierto && (
        <div
          ref={panelRef}
          role='dialog'
          aria-label={`Elegir mes ${label.toLowerCase()}`}
          className={`absolute top-full ${alinear === 'derecha' ? 'right-0' : 'left-0'} z-20 mt-2 w-full min-w-64 origin-top rounded-2xl border border-line bg-surface p-3 shadow-xl shadow-black/10 dark:shadow-black/40 animate-[aparecer_120ms_ease-out]`}
        >
          <div className='mb-3 flex items-center justify-between'>
            <button
              type='button'
              onClick={() => setAnio(a => a - 1)}
              disabled={anio <= anioMin}
              aria-label='Año anterior'
              className='rounded-lg p-1.5 text-muted hover:bg-chip disabled:opacity-30 disabled:hover:bg-transparent'
            >
              <Chevron className='size-5 rotate-180' />
            </button>
            <span className='text-lg font-bold text-ink' aria-live='polite'>{anio}</span>
            <button
              type='button'
              onClick={() => setAnio(a => a + 1)}
              disabled={anio >= anioMax}
              aria-label='Año siguiente'
              className='rounded-lg p-1.5 text-muted hover:bg-chip disabled:opacity-30 disabled:hover:bg-transparent'
            >
              <Chevron className='size-5' />
            </button>
          </div>

          <div className='grid grid-cols-3 gap-1.5'>
            {MESES_CORTOS.map((nombre, i) => {
              const periodo = `${anio}-${String(i + 1).padStart(2, '0')}`
              const elegido = periodo === value
              const enRango = inicioRango && finRango && periodo >= inicioRango && periodo <= finRango
              return (
                <button
                  key={periodo}
                  type='button'
                  data-mes
                  onClick={() => elegir(periodo)}
                  disabled={!habilitados.has(periodo)}
                  aria-pressed={elegido}
                  aria-label={formatearMes(periodo)}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:bg-transparent ${
                    elegido
                      ? 'bg-accent text-on-accent'
                      : enRango
                        ? 'bg-accent-soft text-accent-ink hover:bg-accent/20'
                        : 'text-ink hover:bg-chip'
                  }`}
                >
                  {nombre}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthPicker
