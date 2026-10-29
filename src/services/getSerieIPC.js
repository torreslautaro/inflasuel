import { parsearSerie } from '../lib/inflacion'

// IPC Nivel General Nacional, base dic 2016 = 100, mensual (INDEC vía datos.gob.ar)
export const SERIE_ID = '148.3_INIVELNAL_DICI_M_26'
export const SERIE_URL = `https://datos.gob.ar/series/api/series/?ids=${SERIE_ID}`

// La API devuelve 100 filas por defecto; pedimos todas para tener hasta el último mes publicado.
const API_URL = `https://apis.datos.gob.ar/series/api/series/?ids=${SERIE_ID}&limit=5000&format=json`

const getSerieIPC = async ({ signal } = {}) => {
  const res = await fetch(API_URL, { signal })
  if (!res.ok) throw new Error(`La API respondió ${res.status}`)
  return parsearSerie(await res.json())
}

export default getSerieIPC
