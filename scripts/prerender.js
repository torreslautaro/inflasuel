// Inserta el HTML de la app en dist/index.html, así buscadores y previews
// de WhatsApp/redes ven el contenido sin ejecutar JavaScript.
import { readFile, writeFile, rm } from 'node:fs/promises'

const { render } = await import('../dist-ssr/entry-server.js')
const html = await readFile('dist/index.html', 'utf8')
const vacio = '<div id="root"></div>'

if (!html.includes(vacio)) throw new Error('No encontré el div#root vacío en dist/index.html')

await writeFile('dist/index.html', html.replace(vacio, `<div id="root">${render()}</div>`))
await rm('dist-ssr', { recursive: true, force: true })
console.log('✓ dist/index.html prerenderizado')
