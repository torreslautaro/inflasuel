const Header = () => {
  return (
    <header className='flex items-center justify-between gap-4'>
      <a href='/' className='flex items-center gap-2' aria-label='InflaSuel, inicio'>
        <img className='w-14 sm:w-16' alt='' src='/icon-192.png' width='64' height='64' />
        <span className='text-xl font-black text-brand'>InflaSuel</span>
      </a>
      <a
        href='https://cafecito.app/lautarotorres'
        rel='noopener noreferrer'
        target='_blank'
        className='rounded-md border-b-2 border-b-gray-700 bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-light sm:text-base'
      >
        Invitame un Cafecito
      </a>
    </header>
  )
}

export default Header
