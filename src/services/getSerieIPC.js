import { parsearCSVIndec, parsearSerie } from '../lib/inflacion'

// IPC Nivel General Nacional, base dic 2016 = 100, mensual
export const SERIE_ID = '148.3_INIVELNAL_DICI_M_26'
export const FUENTE_URL = 'https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31'

// Fuente principal: CSV del INDEC, vía el proxy /api/ipc (ver vercel.json y vite.config.js).
// Se actualiza el mismo día que INDEC publica el dato.
const INDEC_URL = '/api/ipc'

// Respaldo: datos.gob.ar, que replica la serie con unas semanas de atraso.
// Devuelve 100 filas por defecto; pedimos todas.
const DATOS_GOB_URL = `https://apis.datos.gob.ar/series/api/series/?ids=${SERIE_ID}&limit=5000&format=json`

const getDesdeIndec = async (signal) => {
  const res = await fetch(INDEC_URL, { signal })
  if (!res.ok) throw new Error(`INDEC respondió ${res.status}`)
  // El CSV viene en Latin-1
  return parsearCSVIndec(new TextDecoder('latin1').decode(await res.arrayBuffer()))
}

const getDesdeDatosGob = async (signal) => {
  const res = await fetch(DATOS_GOB_URL, { signal })
  if (!res.ok) throw new Error(`datos.gob.ar respondió ${res.status}`)
  return parsearSerie(await res.json())
}

const getSerieIPC = async ({ signal } = {}) => {
  try {
    return await getDesdeIndec(signal)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    return getDesdeDatosGob(signal)
  }
}

export default getSerieIPC
