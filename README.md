# InflaSuel

Calculadora que estima cuánto debería aumentar tu sueldo según la inflación acumulada entre dos meses, usando el **IPC Nivel General Nacional** del INDEC (base dic 2016 = 100).

## De dónde salen los datos

1. **INDEC** (principal): el CSV [`serie_ipc_divisiones.csv`](https://www.indec.gob.ar/ftp/cuadros/economia/serie_ipc_divisiones.csv), que se actualiza el día que se publica el IPC. Como no permite CORS, se pide a través de `/api/ipc`, que es un proxy definido en `vercel.json` (producción) y en `vite.config.js` (local).
2. **datos.gob.ar** (respaldo): la serie [`148.3_INIVELNAL_DICI_M_26`](https://datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26), que replica el mismo índice con unas semanas de atraso.

## Cómo calcula

Para un período *desde* → *hasta* (ambos meses incluidos):

```
inflación = IPC(hasta) / IPC(mes anterior a desde) − 1
aumento   = sueldo × inflación
```

Ejemplo: de enero a diciembre usa como base el IPC de diciembre del año anterior, así entra la inflación de enero.

## Desarrollo

Requiere Node 22.12 o superior.

```bash
npm install
npm run dev      # servidor local
npm test         # tests del cálculo
npm run build    # build de producción en dist/
```

## Stack

React 19, Vite 8 y Tailwind CSS 4. Sin backend propio: solo un proxy de Vercel hacia el CSV del INDEC.

## Estructura

- `src/lib/inflacion.js`: cálculo y formateo (funciones puras, con tests en `test/`)
- `src/services/getSerieIPC.js`: pide la serie del IPC (INDEC, con respaldo en datos.gob.ar)
- `src/components/`: Header, selector de mes (año + grilla de meses) y resultado
