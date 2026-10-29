import { formatearMesCorto, formatearPesos, formatearPorcentaje } from '../../lib/inflacion'

const SITIO = 'https://inflasuel.vercel.app'

const compartir = async (texto) => {
  if (navigator.share) {
    try { await navigator.share({ text: texto, url: SITIO }) } catch {}
    return
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${SITIO}`)}`, '_blank', 'noopener')
}

const ResultCard = ({ estado, calculo, sueldo, desde, hasta, onReintentar }) => {
  if (estado === 'error') {
    return (
      <div role='alert' className='flex flex-col gap-3 rounded-3xl bg-accent-soft p-6 text-accent-ink'>
        <p className='font-medium'>No pudimos obtener los datos del INDEC. Revisá tu conexión e intentá de nuevo.</p>
        <button type='button' onClick={onReintentar} className='self-start rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover'>
          Reintentar
        </button>
      </div>
    )
  }

  if (estado === 'cargando' || !calculo) {
    return (
      <div className='rounded-3xl bg-accent-soft p-6' aria-busy='true' aria-label='Cargando datos del INDEC'>
        <div className='h-4 w-28 animate-pulse rounded bg-accent/20' />
        <div className='mt-3 h-10 w-56 animate-pulse rounded-lg bg-accent/20' />
        <div className='mt-3 h-4 w-40 animate-pulse rounded bg-accent/20' />
      </div>
    )
  }

  const { inflacion } = calculo
  const aumento = sueldo * inflacion / 100
  const periodo = desde === hasta ? formatearMesCorto(desde) : `${formatearMesCorto(desde)} a ${formatearMesCorto(hasta)}`
  const textoCompartir = `La inflación de ${periodo} fue ${formatearPorcentaje(inflacion)} según el INDEC. Calculá cuánto debería aumentar tu sueldo:`

  return (
    <div className='rounded-3xl bg-accent-soft p-6 text-accent-ink' aria-live='polite'>
      {sueldo > 0 ? (
        <>
          <p className='text-sm font-medium opacity-80'>Tu nuevo sueldo</p>
          <p className='mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl'>{formatearPesos(sueldo + aumento)}</p>
          <p className='mt-2 text-sm font-medium opacity-80'>
            +{formatearPesos(aumento)} · inflación {formatearPorcentaje(inflacion)}
          </p>
        </>
      ) : (
        <>
          <p className='text-sm font-medium opacity-80'>Inflación del período</p>
          <p className='mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl'>{formatearPorcentaje(inflacion)}</p>
          <p className='mt-2 text-sm font-medium opacity-80'>Ingresá tu sueldo para ver cuánto debería aumentar</p>
        </>
      )}
      <button
        type='button'
        onClick={() => compartir(textoCompartir)}
        className='mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10'
      >
        <svg className='size-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
          <circle cx='18' cy='5' r='3' /><circle cx='6' cy='12' r='3' /><circle cx='18' cy='19' r='3' />
          <path d='m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98' />
        </svg>
        Compartir
      </button>
    </div>
  )
}

export default ResultCard
