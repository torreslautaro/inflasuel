const PREGUNTAS = [
  {
    pregunta: '¿De dónde salen los datos?',
    respuesta: 'Del Índice de Precios al Consumidor (IPC) nivel general nacional que publica el INDEC todos los meses, alrededor de la mitad del mes siguiente. InflaSuel lo toma directamente del INDEC, así que el último mes aparece apenas se publica.'
  },
  {
    pregunta: '¿Cómo se calcula la inflación acumulada?',
    respuesta: 'Se compara el índice del último mes elegido con el del mes anterior al primero. Por ejemplo, de julio a septiembre se usa el IPC de septiembre dividido el de junio, así entra la inflación de los tres meses.'
  },
  {
    pregunta: '¿Por qué no es la suma de las inflaciones mensuales?',
    respuesta: 'Porque la inflación es compuesta: cada mes los precios suben sobre lo que ya habían subido. Tres meses de 2% no dan 6%, dan 6,12%.'
  },
  {
    pregunta: '¿Es el aumento que me corresponde?',
    respuesta: 'Es una referencia para saber cuánto necesitaría aumentar tu sueldo para no perder poder de compra. El aumento real depende de tu convenio, las paritarias o lo que acuerdes con tu empleador.'
  }
]

const Faq = () => {
  return (
    <section aria-labelledby='faq-titulo' className='flex flex-col gap-2'>
      <h2 id='faq-titulo' className='text-xl font-bold'>Preguntas frecuentes</h2>
      {PREGUNTAS.map(({ pregunta, respuesta }) => (
        <details key={pregunta} className='group rounded-2xl border border-line bg-surface px-5 py-4'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden'>
            <h3>{pregunta}</h3>
            <span className='text-xl leading-none text-accent transition-transform group-open:rotate-45' aria-hidden='true'>+</span>
          </summary>
          <p className='mt-2 text-muted'>{respuesta}</p>
        </details>
      ))}
    </section>
  )
}

export default Faq
