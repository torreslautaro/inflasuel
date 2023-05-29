
import arrowDown from '../../assets/arrowDown.svg'

const Dropdown = ({fecha,menuRef,setOpen,open,children}) => {
  return (
    <div className="dropdown block relative" ref={menuRef}>
      <button type='button' className=" flex items-center justify-center w-fit bg-gray-300 rounded-lg text-center py-2 px-2 border-2 border-transparent transition-[border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s] hover:outline-none hover:border-gray-900 hover:bg-white focus:bg-white focus:outline-none focus:border-gray-900" onClick={() => setOpen(!open)}>
        <span className="w-full text-xs">{fecha !== '' ? fecha   : 'Selecciona una opción'}</span>
        <span ><img className='w-5 h-fit mt-1' src={arrowDown} alt="Icono flecha hacia abajo" /></span>
      </button>
      <div className="bg-white text-base z-50 list-none divide-y w-fit divide-gray-100 rounded shadow my-4 relative" id="dropdown">
        {
          open &&  
            <ul className="absolute flex flex-col items-center py-2 overflow-y-auto h-32 w-32 bg-white" aria-labelledby="dropdown">
              {
                children
              }
            </ul>
        }
      
      </div>
    </div>
  )
}

export default Dropdown