export const PRESETS = [
  { id: 'elegir', label: 'Elegir' },
  { id: '3', label: '3 meses' },
  { id: '6', label: '6 meses' },
  { id: '12', label: '12 meses' },
  { id: 'anio', label: 'Este año' }
]

const PeriodChips = ({ modo, onChange, disabled }) => (
  <div className='flex flex-wrap gap-2' role='group' aria-label='Período'>
    {PRESETS.map(({ id, label }) => {
      const activo = id === modo
      return (
        <button
          key={id}
          type='button'
          onClick={() => onChange(id)}
          disabled={disabled}
          aria-pressed={activo}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            activo ? 'bg-accent text-on-accent' : 'bg-chip text-ink hover:bg-line'
          }`}
        >
          {label}
        </button>
      )
    })}
  </div>
)

export default PeriodChips
