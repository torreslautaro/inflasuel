const DropDownItems = ({periodos,handleOnChange}) => {
  return (
    periodos && periodos.map(periodo => <li className='hover:bg-[#aeb8d6] w-full text-center rounded-md' key={periodo.value} onClick={handleOnChange}>{periodo.label}</li>)
  )
}

export default DropDownItems