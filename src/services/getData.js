import { DateTime } from 'luxon'


const API_URL = 'https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26'
const calcularInflacion = (datos, sueldo) => {
  const longitud = datos.length
  const inflacion = Math.round((((datos[longitud-1].valor - datos[0].valor) / datos[0].valor) * 100) * 100) / 100

  const aumentoSueldo = Math.round((Number(sueldo) * (inflacion/100)) * 100) / 100

  const sueldoTotal = Number(sueldo) + aumentoSueldo
  return {inflacion, aumentoSueldo, sueldoTotal}
}

const getData = (startDate, endDate, sueldo) => {
  startDate = DateTime.fromISO(startDate).plus({month:-1}).toISODate()
  return fetch(`${API_URL}&start_date=${startDate}&end_date=${endDate}`)
    .then(res => res.json())
    .then(res => {
      const datos = res.data.map(dato => {
        const [periodo, valor] = dato
        return {periodo, valor}
      })
      return calcularInflacion(datos, sueldo)
    })
 
}

export const getPeriodos = () => {
  return fetch(`${API_URL}`)
    .then(res => res.json())
    .then(res => {
      const datos = res.data.map(dato => {
        const [periodo] = dato
        return {value : DateTime.fromISO(periodo).toFormat('yyyy-MM'), label: DateTime.fromISO(periodo).toFormat('yyyy-MM')}
      })  
      return datos.reverse()
    })
}

export default getData