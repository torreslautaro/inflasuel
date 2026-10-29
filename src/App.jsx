import { useEffect, useMemo, useState } from 'react'
import getSerieIPC, { FUENTE_URL } from './services/getSerieIPC'
import { calcularInflacion, formatearMes, formatearMesCorto } from './lib/inflacion'
import Header from './components/Header'
import ResultCard from './components/ResultCard'
import PeriodChips from './components/PeriodChips'
import MonthPicker from './components/MonthPicker'
import SalaryInput from './components/SalaryInput'
import Faq from './components/Faq'

// Devuelve [desde, hasta] para un atajo de período, contando desde el último mes publicado.
// El índice 0 es la base de la serie, así que "desde" arranca como mínimo en 1.
const rangoDePreset = (serie, modo) => {
  const ultimo = serie.length - 1
  const hasta = serie[ultimo].periodo
  if (modo === 'anio') {
    const enero = serie.findIndex(d => d.periodo === `${hasta.slice(0, 4)}-01`)
    return [serie[Math.max(1, enero)].periodo, hasta]
  }
  return [serie[Math.max(1, ultimo - Number(modo) + 1)].periodo, hasta]
}

function App() {
  const [serie, setSerie] = useState([])
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [intento, setIntento] = useState(0)
  const [modo, setModo] = useState('elegir')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [sueldo, setSueldo] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setEstado('cargando')
    getSerieIPC({ signal: controller.signal })
      .then(datos => {
        setSerie(datos)
        // Por defecto se eligen los meses a mano, arrancando por los últimos 3 publicados
        const [d, h] = rangoDePreset(datos, '3')
        setModo('elegir')
        setDesde(d)
        setHasta(h)
        setEstado('listo')
      })
      .catch(err => {
        if (err.name !== 'AbortError') setEstado('error')
      })
    return () => controller.abort()
  }, [intento])

  const calculo = useMemo(() => {
    if (estado !== 'listo') return null
    try {
      return calcularInflacion(serie, desde, hasta)
    } catch {
      return null
    }
  }, [serie, desde, hasta, estado])

  // El primer mes de la serie es la base, no se puede usar como "desde"
  const periodosDesde = serie.slice(1).map(d => d.periodo)
  const periodosHasta = periodosDesde.filter(p => p >= desde)
  const ultimoPeriodo = serie.at(-1)?.periodo
  const listo = estado === 'listo'

  const handleModo = (nuevo) => {
    setModo(nuevo)
    if (nuevo === 'elegir') return
    const [d, h] = rangoDePreset(serie, nuevo)
    setDesde(d)
    setHasta(h)
  }

  const handleDesde = (valor) => {
    setDesde(valor)
    if (hasta < valor) setHasta(valor)
  }

  return (
    <div className='flex min-h-dvh flex-col bg-bg font-sans text-ink antialiased'>
      <div className='mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-5 sm:py-8'>
        <Header />

        <main className='flex flex-col gap-8'>
          <section>
            <h1 className='text-3xl leading-tight font-bold tracking-tight sm:text-4xl'>
              Calculá el aumento de tu sueldo
            </h1>
            <p className='mt-2 text-muted'>
              Según la inflación oficial del INDEC. Gratis y sin registrarte.
            </p>
          </section>

          <section className='flex flex-col gap-6' aria-label='Calculadora'>
            <ResultCard
              estado={estado}
              calculo={calculo}
              sueldo={sueldo}
              desde={desde}
              hasta={hasta}
              onReintentar={() => setIntento(i => i + 1)}
            />

            <div className='flex flex-col gap-6 rounded-3xl border border-line bg-surface p-5 sm:p-6'>
              <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium text-muted'>Período</span>
                <PeriodChips modo={modo} onChange={handleModo} disabled={!listo} />
                {modo === 'elegir' ? (
                  <div className='grid grid-cols-2 gap-3'>
                    <MonthPicker id='desde' label='Desde' value={desde} onChange={handleDesde} periodos={periodosDesde} rango={[desde, hasta]} disabled={!listo} />
                    <MonthPicker id='hasta' label='Hasta' value={hasta} onChange={setHasta} periodos={periodosHasta} rango={[desde, hasta]} disabled={!listo} alinear='derecha' />
                  </div>
                ) : (
                  <p className='text-sm text-muted'>
                    {listo ? `${formatearMesCorto(desde)} → ${formatearMesCorto(hasta)}` : 'Cargando meses…'}
                  </p>
                )}
              </div>

              <SalaryInput value={sueldo} onChange={setSueldo} disabled={!listo} />
            </div>

            {ultimoPeriodo && (
              <p className='text-center text-sm text-muted'>
                Datos del INDEC actualizados a <span className='font-medium text-accent'>{formatearMes(ultimoPeriodo).toLowerCase()}</span>
              </p>
            )}
          </section>

          <Faq />
        </main>

        <footer className='mt-auto flex flex-col items-center gap-1 border-t border-line pt-6 text-center text-sm text-muted'>
          <p>
            Datos del{' '}
            <a className='font-medium text-accent hover:underline' href={FUENTE_URL} target='_blank' rel='noopener noreferrer'>
              Índice de Precios al Consumidor (IPC)
            </a>{' '}
            del INDEC. El resultado es una estimación de referencia.
          </p>
          <p>
            Hecho por{' '}
            <a className='font-medium text-accent hover:underline' href='https://github.com/torreslautaro' target='_blank' rel='noopener noreferrer'>
              Lautaro Torres
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
