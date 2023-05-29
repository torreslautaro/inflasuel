import './App.css'
import { useState, useEffect,useRef } from 'react';
import getData, { getPeriodos } from './services/getData';
import useListenOutsideClicks from './hooks/useListenOutsideClicks';
import Header from './components/Header';
import Dropdown from './components/Dropdown';
import arrowDown from './assets/arrowDown.svg'
import DropDownItems from './components/DropdownItems';

function App() {
  const [periodos, setPeriodo] = useState('')
  const [fechadesde, setFechaDeste] = useState('')
  const [fechahasta, setFechaHasta] = useState('')
  const [inflacion, setInflacion] = useState(null)
  const [sueldo, setSueldo] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDesde, setOpenDesde] =  useState(false)
  const [openHasta, setOpenHasta] =  useState(false)
  const menuRefDesde = useRef(null)
  const menuRefHasta = useRef(null)
  const [listeningDesde, setListeningDesde] = useState(false)
  const [listeningHasta, setListeningHasta] = useState(false)

  useEffect(() => {
    getPeriodos()
      .then(res => {
        setPeriodo(res)
      })
    
  },[])

  useEffect(() => {
    useListenOutsideClicks(listeningDesde, setListeningDesde, menuRefDesde, setOpenDesde)
  })

  useEffect(() => {
    useListenOutsideClicks(listeningHasta, setListeningHasta, menuRefHasta, setOpenHasta)
  })

 

  const handleOnChangeDesde = (evt) => {
    evt.stopPropagation()
    setFechaDeste(evt.target.textContent)
  }

  const handleOnChangeHasta = (evt) => {
    evt.stopPropagation()
    setFechaHasta(evt.target.textContent)
  }

  const handleOnChangeSueldo = (evt) => {
    setSueldo(evt.target.value)
  }

  const handleOnSubmit = (evt) => {
    evt.preventDefault()
    setLoading(true)
    getData(fechadesde, fechahasta, sueldo)
      .then(res => {
        setInflacion(res)
        setLoading(false)
      })
  }


  return (
    <div className='w-screen h-screen bg-[#fdf7f2] flex flex-col font-sans'>
      <div className='w-4/5 h-full self-center p-8 flex flex-col justify-between'>
        <Header />
        <main className='grid grid-row-2 gap-14 mb-12' >
          <section className='flex flex-col content-center justify-center grid-cols-1'>
            <h1 className='pt-4 mx-auto mb-8 text-4xl font-black xl:pt-6 sm:text-[4rem] lg:text-[3rem] leading-none '>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#9891c0] via-[#7c75a2] to-[#9891c0]'>Calcula el aumento de tu sueldo!</span>
            </h1>
            <p className='text-center'>
              <span className='block text-lg font-bold tracking-widest text-gray-700'>Con InflaSuel vas a poder calcular el aumento de tu sueldo </span>
              <span className='block text-lg font-bold tracking-widest text-gray-700'>en base a la inflación acumulada de un periodo demerminado.</span>
            </p>
          </section>
          <section className=' justify-self-center grid-cols-2'>
            <form className='flex flex-col justify-between mb-7' onSubmit={handleOnSubmit}>
              <div className='flex justify-between mb-2 gap-4'>
              <label className='flex flex-col mb-1 text-md font-bold text-gray-500 transition-[color .3s cubic-bezier(.25,.01,.25,1) 0s] hover:text-gray-900'>
                  <span>Desde:</span>
                  <Dropdown 
                  fecha={fechadesde}
                  menuRef={menuRefDesde}
                  setOpen={setOpenDesde}
                  open={openDesde}
                  >
                    <DropDownItems 
                      periodos={periodos}
                      handleOnChange={handleOnChangeDesde}
                    />
                  </Dropdown>
                  
                </label>
                <label className='flex flex-col mb-1 text-md font-bold text-gray-500 transition-[color .3s cubic-bezier(.25,.01,.25,1) 0s] hover:text-gray-900'>
                  <span>Hasta:</span>
                  <Dropdown 
                  fecha={fechahasta}
                  menuRef={menuRefHasta}
                  setOpen={setOpenHasta}
                  open={openHasta}
                  >
                    <DropDownItems 
                      periodos={periodos}
                      handleOnChange={handleOnChangeHasta}
                    />
                  </Dropdown>
                </label>
                <label className='flex flex-col mb-1 text-md font-bold text-gray-500 transition-[color .3s cubic-bezier(.25,.01,.25,1) 0s] hover:text-gray-900'>
                  <span className=''>Sueldo Básico:</span>
                  <input type="number" className='max-w-[190px] bg-gray-300 rounded-lg text-center py-2 border-2 border-transparent transition-[border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s] hover:outline-none hover:border-gray-900 hover:bg-white focus:bg-white focus:outline-none focus:border-gray-900' onChange={handleOnChangeSueldo} />
                </label>
              </div>
              <button className='w-full self-center bg-[#7c75a2] text-white py-2 px-2 font-semibold text-lg border-2 rounded-md shadow-[0.1em_0.1em] shadow-gray-900 border-gray-900 transition hover:bg-[#aeb8d6]' on>
                {loading 
                  ? <span className='flex justify-center'><svg className="border-t-transparent w-8 h-8 border-4 border-white border-solid rounded-full animate-spin mx-3" viewBox="0 0 24 24"></svg>Calculando...</span>
                  : <span>Calcular</span>
                }
              </button>
              <p className='text-center mt-5 text-sm font-bold text-gray-700'>
              Datos actualizados al: 
              <span className='text-[#7c75a2] font-extrabold underline ml-1'>{periodos.length > 0 ? periodos[0].label : null}</span>
            </p>
            </form>
            <div className='flex flex-col gap-2'>
            {
              loading ? 'Calculando...' :
                inflacion ? 
                <div>
                <p className='text-md font-semibold text-slate-700'>Inflación acumulada del periodo seleccionado: <span className='font-bold text-lg text-slate-800'>{inflacion.inflacion}%</span></p> 
                <p className='text-md font-semibold text-slate-700'>Aumento correspondiente: <span className='font-bold text-lg text-slate-800'>${inflacion.aumentoSueldo}</span></p>
                <p className='text-md font-semibold text-slate-700' >Sueldo básico estimado: <span className='font-bold text-lg text-slate-800'>${inflacion.sueldoTotal}</span></p>
                </div>
                : ''
            }
            </div>
          </section>
        </main>
        <footer className='h-fit self-center flex flex-col items-center gap-3'>
        <span className='font-semibold text-slate-700'>Los datos fueron obtenidos de la base del <a className='font-extrabold text-[#7c75a2] hover:underline' href='https://datos.gob.ar/series/api/series/?ids=145.3_INGNACUAL_DICI_M_38&chartType=column' alt="Datos oficiales del IPC">índice nacional de precios al consumidor(IPC)</a> del INDEC.</span>
        <p className='font-semibold text-slate-700'>Desarrollado por <a className=' font-extrabold text-[#7c75a2] hover:underline' href='https://github.com/torreslautaro' alt="Ir al perfirl de Github de Lautaro Torres">Lautaro Torres</a></p>
        </footer>
      </div>
    </div>
  )
}

export default App
