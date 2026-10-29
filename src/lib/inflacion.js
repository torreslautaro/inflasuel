// Funciones puras: no dependen de React ni de la red, así se pueden testear.

const MESES = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const PESOS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
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
export const calcularAumento = (serie, desde, hasta, sueldo) => {
  const iDesde = serie.findIndex(d => d.periodo === desde)
  const iHasta = serie.findIndex(d => d.periodo === hasta)

  if (iDesde < 1) throw new Error('Elegí un mes "desde" válido')
  if (iHasta < 0) throw new Error('Elegí un mes "hasta" válido')
  if (iHasta < iDesde) throw new Error('El mes "hasta" no puede ser anterior al mes "desde"')
  if (!(sueldo > 0)) throw new Error('Ingresá un sueldo mayor a cero')

  const base = serie[iDesde - 1].valor
  const inflacion = (serie[iHasta].valor / base - 1) * 100
  const aumento = sueldo * inflacion / 100

  return { inflacion, aumento, sueldoTotal: sueldo + aumento }
}

export const formatearMes = (periodo) => {
  const texto = MESES.format(new Date(`${periodo}-01T00:00:00Z`))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export const formatearPesos = (n) => PESOS.format(n)
export const formatearPorcentaje = (n) => `${PORCENTAJE.format(n)}%`
