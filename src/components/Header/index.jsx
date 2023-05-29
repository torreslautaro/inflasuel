import logo from '../../assets/Logo2.png'

const Header = () => {
  return (
    <header className='h-fit flex justify-between items-center'>
      <div className='w-fit h-fit relative'>
        <img className='w-20' alt='Logo InflaSuel' src={logo} />
        <span className='absolute top-[1.23rem] left-[1.9rem] text-xs font-mono font-semibold text-[#7c75a2]'>IS%</span>
      </div>
      <div>
        <a 
        href='https://cafecito.app/lautarotorres'
        rel='noopener' 
        target='_blank'
        alt='Invitame un café en cafecito.app'
        className='bg-[#7c75a2] px-3 py-3 rounded-md border-b-2 border-b-gray-700 text-white font-semibold transition hover:bg-[#aeb8d6]'
        >
          Invitame un Cafecito
        </a>
      </div>
    </header>
  )
}

export default Header