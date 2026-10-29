// El tema inicial lo aplica el script de index.html; acá solo se alterna.
// Los íconos se muestran por CSS (dark:) para que el HTML prerenderizado coincida.
const alternarTema = () => {
  const oscuro = document.documentElement.classList.toggle('dark')
  try { localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro') } catch {}
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#121118' : '#f7f6fb')
}

const ThemeToggle = () => (
  <button
    type='button'
    onClick={alternarTema}
    aria-label='Cambiar entre modo claro y oscuro'
    title='Modo claro / oscuro'
    className='grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-chip hover:text-ink'
  >
    {/* Luna en modo claro */}
    <svg className='size-5 dark:hidden' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
    </svg>
    {/* Sol en modo oscuro */}
    <svg className='hidden size-5 dark:block' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
    </svg>
  </button>
)

export default ThemeToggle
