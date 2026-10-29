import ThemeToggle from '../ThemeToggle'

const Header = () => {
  return (
    <header className='flex items-center justify-between gap-3'>
      <a href='/' className='flex items-center gap-2' aria-label='InflaSuel, inicio'>
        <img className='size-9' alt='' src='/icon-192.png' width='36' height='36' />
        <span className='text-lg font-bold text-accent'>InflaSuel</span>
      </a>
      <div className='flex items-center gap-1'>
        <ThemeToggle />
        <a
          href='https://cafecito.app/lautarotorres'
          rel='noopener noreferrer'
          target='_blank'
          className='rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-chip hover:text-ink'
        >
          <span className='sm:hidden'>☕ Cafecito</span>
          <span className='hidden sm:inline'>☕ Invitame un cafecito</span>
        </a>
      </div>
    </header>
  )
}

export default Header
