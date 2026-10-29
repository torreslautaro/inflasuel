import { formatearMes } from '../../lib/inflacion'

const PeriodSelect = ({ id, label, value, onChange, periodos, disabled }) => {
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={id} className='text-sm font-bold text-gray-600'>{label}</label>
      <select
        id={id}
        value={value}
        onChange={evt => onChange(evt.target.value)}
        disabled={disabled}
        className='field'
      >
        {periodos.map(periodo => (
          <option key={periodo} value={periodo}>{formatearMes(periodo)}</option>
        ))}
      </select>
    </div>
  )
}

export default PeriodSelect
