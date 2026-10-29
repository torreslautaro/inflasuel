import { formatearPesos, formatearPorcentaje } from '../../lib/inflacion'

const Fila = ({ label, children, destacado }) => (
  <div className='flex flex-wrap items-baseline justify-between gap-x-4 py-2'>
    <dt className='font-semibold text-slate-700'>{label}</dt>
    <dd className={destacado ? 'text-2xl font-black text-brand' : 'text-lg font-bold text-slate-800'}>{children}</dd>
  </div>
)

const Result = ({ resultado }) => {
  const { inflacion, aumento, sueldoTotal } = resultado
  return (
    <dl className='divide-y divide-gray-200 rounded-lg border-2 border-gray-900 bg-white px-4 py-2 shadow-[0.2em_0.2em] shadow-gray-900'>
      <Fila label='Inflación acumulada del período'>{formatearPorcentaje(inflacion)}</Fila>
      <Fila label='Aumento correspondiente'>{formatearPesos(aumento)}</Fila>
      <Fila label='Sueldo básico actualizado' destacado>{formatearPesos(sueldoTotal)}</Fila>
    </dl>
  )
}

export default Result
