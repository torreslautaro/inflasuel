# InflaSuel

Calculadora que estima cuánto debería aumentar tu sueldo según la inflación acumulada entre dos meses, usando el **IPC Nivel General Nacional** del INDEC (serie [`148.3_INIVELNAL_DICI_M_26`](https://datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26) de datos.gob.ar).

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

React 19, Vite 8 y Tailwind CSS 4. Sin backend: los datos se piden directo a la API pública de datos.gob.ar desde el navegador.

## Estructura

- `src/lib/inflacion.js`: cálculo y formateo (funciones puras, con tests en `test/`)
- `src/services/getSerieIPC.js`: pide la serie del IPC a la API
- `src/components/`: Header, selector de período y resultado
