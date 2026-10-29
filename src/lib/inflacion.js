// Funciones puras: no dependen de React ni de la red, así se pueden testear.

const MESES = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const PESOS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const PORCENTAJE = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// La API devuelve [["2016-12-01", 100], ...]; lo pasamos a [{ periodo: "2016-12", valor: 100 }]
export const parsearSerie = (json) => {
  if (!Array.isArray(json?.data)) throw new Error('Respuesta inesperada de la API')
  return json.data
    .filter(([, valor]) => typeof valor === 'number')
    .map(([fecha, valor]) => ({ periodo: fecha.slice(0, 7), valor }))
}

// CSV del INDEC (serie_ipc_divisiones.csv): separado por ";", decimales con coma, período AAAAMM.
// Nos quedamos con el nivel general nacional.
export const parsearCSVIndec = (texto) => {
  const serie = texto
    .split(/\r?\n/)
    .map(linea => linea.split(';'))
    .filter(([codigo, , , , , , , region]) => codigo === '0' && region === 'Nacional')
    .map(([, , , periodo, indice]) => ({
      periodo: `${periodo.slice(0, 4)}-${periodo.slice(4, 6)}`,
      valor: Number(indice.replace(',', '.'))
    }))
    .filter(d => /^\d{4}-\d{2}$/.test(d.periodo) && Number.isFinite(d.valor))
    .sort((a, b) => a.periodo.localeCompare(b.periodo))

  if (serie.length === 0) throw new Error('CSV del INDEC sin datos del nivel general nacional')
  return serie
}

// Inflación acumulada desde el inicio de `desde` hasta el final de `hasta` (ambos inclusive).
// Por eso la base es el índice del mes anterior a `desde`.
export const calcularInflacion = (serie, desde, hasta) => {
  const iDesde = serie.findIndex(d => d.periodo === desde)
  const iHasta = serie.findIndex(d => d.periodo === hasta)

  if (iDesde < 1) throw new Error('Elegí un mes "desde" válido')
  if (iHasta < 0) throw new Error('Elegí un mes "hasta" válido')
  if (iHasta < iDesde) throw new Error('El mes "hasta" no puede ser anterior al mes "desde"')

  const meses = serie.slice(iDesde, iHasta + 1).map((d, i) => ({
    periodo: d.periodo,
    variacion: (d.valor / serie[iDesde + i - 1].valor - 1) * 100
  }))

  return { inflacion: (serie[iHasta].valor / serie[iDesde - 1].valor - 1) * 100, meses }
}

export const calcularAumento = (serie, desde, hasta, sueldo) => {
  if (!(sueldo > 0)) throw new Error('Ingresá un sueldo mayor a cero')
  const { inflacion } = calcularInflacion(serie, desde, hasta)
  const aumento = sueldo * inflacion / 100
  return { inflacion, aumento, sueldoTotal: sueldo + aumento }
}

// "1.000.000" o "$ 1000000" -> 1000000 (solo pesos enteros)
export const parsearSueldo = (texto) => Number(String(texto).replace(/\D/g, '')) || 0

const MILES = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
export const formatearMiles = (n) => (n > 0 ? MILES.format(n) : '')

export const formatearMes = (periodo) => {
  const texto = MESES.format(new Date(`${periodo}-01T00:00:00Z`))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export const formatearPesos = (n) => PESOS.format(n)
export const formatearPorcentaje = (n) => `${PORCENTAJE.format(n)}%`

export const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// "2026-09" -> "Sep 2026"
export const formatearMesCorto = (periodo) => `${MESES_CORTOS[Number(periodo.slice(5, 7)) - 1]} ${periodo.slice(0, 4)}`

const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const mesLargo = (periodo) => MESES_LARGOS[Number(periodo.slice(5, 7)) - 1]

// Para textos: "junio a septiembre de 2026", "diciembre de 2025 a marzo de 2026" o "septiembre de 2026"
export const formatearRango = (desde, hasta) => {
  const [anioDesde, anioHasta] = [desde.slice(0, 4), hasta.slice(0, 4)]
  if (desde === hasta) return `${mesLargo(hasta)} de ${anioHasta}`
  if (anioDesde === anioHasta) return `${mesLargo(desde)} a ${mesLargo(hasta)} de ${anioHasta}`
  return `${mesLargo(desde)} de ${anioDesde} a ${mesLargo(hasta)} de ${anioHasta}`
}
