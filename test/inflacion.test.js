import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parsearSerie, parsearCSVIndec, calcularAumento, formatearMes } from '../src/lib/inflacion.js'

const serie = parsearSerie({
  data: [
    ['2016-12-01', 100],
    ['2017-01-01', 110],
    ['2017-02-01', 121],
    ['2017-03-01', null],
  ]
})

test('parsearSerie convierte fechas a YYYY-MM y descarta valores vacíos', () => {
  assert.deepEqual(serie.map(d => d.periodo), ['2016-12', '2017-01', '2017-02'])
})

test('un solo mes usa como base el mes anterior', () => {
  const r = calcularAumento(serie, '2017-01', '2017-01', 1000)
  assert.ok(Math.abs(r.inflacion - 10) < 1e-9)
  assert.ok(Math.abs(r.aumento - 100) < 1e-9)
  assert.ok(Math.abs(r.sueldoTotal - 1100) < 1e-9)
})

test('acumula los meses compuestos', () => {
  const r = calcularAumento(serie, '2017-01', '2017-02', 1000)
  assert.ok(Math.abs(r.inflacion - 21) < 1e-9)
  assert.ok(Math.abs(r.sueldoTotal - 1210) < 1e-9)
})

test('valida los datos de entrada', () => {
  assert.throws(() => calcularAumento(serie, '2016-12', '2017-01', 1000), /desde/)
  assert.throws(() => calcularAumento(serie, '2017-02', '2017-01', 1000), /anterior/)
  assert.throws(() => calcularAumento(serie, '2017-01', '2017-02', 0), /sueldo/)
  assert.throws(() => calcularAumento(serie, '2017-01', '2017-02', NaN), /sueldo/)
})

test('formatearMes muestra el mes en español', () => {
  assert.equal(formatearMes('2026-08'), 'Agosto de 2026')
})

test('parsearCSVIndec toma solo el nivel general nacional', () => {
  const csv = [
    'Codigo;Descripcion;Clasificador;Periodo;Indice_IPC;v_m_IPC;v_i_a_IPC;Region',
    '0;NIVEL GENERAL;Nivel general y divisiones COICOP;201612;100;NA;NA;GBA',
    '0;NIVEL GENERAL;Nivel general y divisiones COICOP;201701;101,5859;1,6;NA;Nacional',
    '0;NIVEL GENERAL;Nivel general y divisiones COICOP;201612;100;NA;NA;Nacional',
    '01;Alimentos y bebidas no alcohólicas;Nivel general y divisiones COICOP;201612;100;NA;NA;Nacional',
    ''
  ].join('\r\n')
  assert.deepEqual(parsearCSVIndec(csv), [
    { periodo: '2016-12', valor: 100 },
    { periodo: '2017-01', valor: 101.5859 }
  ])
  assert.throws(() => parsearCSVIndec('basura'))
})
