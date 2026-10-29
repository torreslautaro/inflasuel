import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Se usa solo en el build (scripts/prerender.js) para que el HTML llegue con contenido
export const render = () => renderToString(
  <StrictMode>
    <App />
  </StrictMode>
)
