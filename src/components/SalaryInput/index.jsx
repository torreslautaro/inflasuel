import { formatearMiles, parsearSueldo } from '../../lib/inflacion'

// Muestra el sueldo con separador de miles mientras se escribe
const SalaryInput = ({ value, onChange, disabled }) => (
  <div className='flex flex-col gap-2'>
    <label htmlFor='sueldo' className='text-sm font-medium text-muted'>Sueldo actual</label>
    <div className='relative'>
      <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg text-muted'>$</span>
      <input
        id='sueldo'
        type='text'
        inputMode='numeric'
        autoComplete='off'
        placeholder='850.000'
        value={formatearMiles(value)}
        onChange={evt => onChange(parsearSueldo(evt.target.value))}
        disabled={disabled}
        className='field py-3 pl-9 text-lg font-medium tabular-nums'
      />
    </div>
  </div>
)

export default SalaryInput
