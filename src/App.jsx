import { useEffect, useState } from 'react'
import getSerieIPC, { SERIE_URL } from './services/getSerieIPC'
import { calcularAumento, formatearMes } from './lib/inflacion'
import Header from './components/Header'
import PeriodSelect from './components/PeriodSelect'
import Result from './components/Result'

function App() {
  const [serie, setSerie] = useState([])
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [intento, setIntento] = useState(0)
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [sueldo, setSueldo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setEstado('cargando')
    getSerieIPC({ signal: controller.signal })
      .then(datos => {
        setSerie(datos)
        // Por defecto: los últimos 12 meses publicados
        const ultimo = datos.length - 1
        setHasta(datos[ultimo].periodo)
        setDesde(datos[Math.max(1, ultimo - 11)].periodo)
        setEstado('listo')
      })
      .catch(err => {
        if (err.name !== 'AbortError') setEstado('error')
      })
    return () => controller.abort()
  }, [intento])

  // El primer mes de la serie es la base, no se puede usar como "desde"
  const periodosDesde = serie.slice(1).map(d => d.periodo).reverse()
  const periodosHasta = serie.slice(1).filter(d => d.periodo >= desde).map(d => d.periodo).reverse()
  const ultimoPeriodo = serie.at(-1)?.periodo

  const limpiarResultado = () => {
    setResultado(null)
    setError('')
  }

  const handleDesde = (valor) => {
    setDesde(valor)
    if (hasta < valor) setHasta(valor)
    limpiarResultado()
  }

  const handleHasta = (valor) => {
    setHasta(valor)
    limpiarResultado()
  }

  const handleSueldo = (evt) => {
    setSueldo(evt.target.value)
    limpiarResultado()
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    try {
      setResultado(calcularAumento(serie, desde, hasta, Number(sueldo)))
      setError('')
    } catch (err) {
      setResultado(null)
      setError(err.message)
    }
  }

  const deshabilitado = estado !== 'listo'

  return (
    <div className='flex min-h-dvh flex-col bg-cream font-sans text-gray-900'>
      <div className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-6 sm:px-8'>
        <Header />

        <main className='flex flex-col gap-8'>
          <section className='text-center'>
            <h1 className='bg-linear-to-r from-brand-soft via-brand to-brand-soft bg-clip-text text-4xl leading-tight font-black text-transparent sm:text-5xl'>
              ¡Calculá el aumento de tu sueldo!
            </h1>
            <p className='mt-4 text-lg font-semibold text-gray-700'>
              Con InflaSuel calculás cuánto debería aumentar tu sueldo según la inflación acumulada en el período que elijas.
            </p>
          </section>

          <section className='flex flex-col gap-6'>
            {estado === 'error' && (
              <div role='alert' className='flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-red-700 bg-red-50 p-4 text-red-800'>
                <span className='font-semibold'>No pudimos obtener los datos del INDEC. Revisá tu conexión e intentá de nuevo.</span>
                <button type='button' onClick={() => setIntento(i => i + 1)} className='rounded-md bg-red-700 px-3 py-1 font-semibold text-white hover:bg-red-800'>
                  Reintentar
                </button>
              </div>
            )}

            <form className='flex flex-col gap-4' onSubmit={handleSubmit} noValidate>
              <div className='grid gap-4 sm:grid-cols-3'>
                <PeriodSelect id='desde' label='Desde' value={desde} onChange={handleDesde} periodos={periodosDesde} disabled={deshabilitado} />
                <PeriodSelect id='hasta' label='Hasta' value={hasta} onChange={handleHasta} periodos={periodosHasta} disabled={deshabilitado} />
                <div className='flex flex-col gap-1'>
                  <label htmlFor='sueldo' className='text-sm font-bold text-gray-600'>Sueldo básico ($)</label>
                  <input
                    id='sueldo'
                    type='number'
                    inputMode='decimal'
                    min='0'
                    step='0.01'
                    placeholder='Ej: 850000'
                    value={sueldo}
                    onChange={handleSueldo}
                    disabled={deshabilitado}
                    className='field'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={deshabilitado}
                className='flex w-full items-center justify-center gap-3 rounded-md border-2 border-gray-900 bg-brand px-2 py-2 text-lg font-semibold text-white shadow-[0.1em_0.1em] shadow-gray-900 transition hover:bg-brand-light disabled:cursor-wait disabled:opacity-70'
              >
                {estado === 'cargando' && <span className='size-5 animate-spin rounded-full border-4 border-white border-t-transparent' aria-hidden='true' />}
                {estado === 'cargando' ? 'Cargando datos…' : 'Calcular'}
              </button>

              {ultimoPeriodo && (
                <p className='text-center text-sm font-bold text-gray-700'>
                  Datos actualizados a: <span className='font-extrabold text-brand'>{formatearMes(ultimoPeriodo)}</span>
                </p>
              )}
            </form>

            <div aria-live='polite'>
              {error && <p className='rounded-lg bg-amber-100 p-3 text-center font-semibold text-amber-900'>{error}</p>}
              {resultado && <Result resultado={resultado} />}
            </div>
          </section>
        </main>

        <footer className='mt-auto flex flex-col items-center gap-2 text-center text-sm font-semibold text-slate-700'>
          <p>
            Datos del{' '}
            <a className='font-extrabold text-brand hover:underline' href={SERIE_URL} target='_blank' rel='noopener noreferrer'>
              Índice de Precios al Consumidor (IPC)
            </a>{' '}
            del INDEC. El resultado es una estimación de referencia.
          </p>
          <p>
            Hecho por{' '}
            <a className='font-extrabold text-brand hover:underline' href='https://github.com/torreslautaro' target='_blank' rel='noopener noreferrer'>
              Lautaro Torres
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
