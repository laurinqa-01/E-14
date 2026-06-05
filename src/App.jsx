import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {

  const [tables, setTables] = useState([])

  useEffect(() => {
    fetchData()
    
    // Importamos la fuente informática 'Orbitron'
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // ELIMINACIÓN DEFINITIVA DE BORDES BLANCOS Y EFECTOS HOVER COMPLETOS
    const styleTag = document.createElement('style')
    styleTag.innerHTML = `
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #080004 !important;
        width: 100% !important;
        height: 100% !important;
        overflow-x: hidden;
      }
      
      /* Hover interactivo para tarjetas normales (Súper Neón Amarillo) */
      .cute-card {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
      }
      .cute-card:hover {
        transform: translateY(-6px);
        border-color: #fffb00 !important;
        box-shadow: 0 0 25px #fffb00, 0 0 10px rgba(255, 251, 0, 0.6) !important;
        cursor: pointer;
      }

      /* Hover interactivo para tarjetas con fraude (Súper Neón Rosa) */
      .cute-card-fraud {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
      }
      .cute-card-fraud:hover {
        transform: translateY(-6px);
        box-shadow: 0 0 35px #ff007f, 0 0 15px rgba(255, 0, 127, 0.6) !important;
        cursor: pointer;
      }

      /* Hover interactivo para el Botón Forense */
      .cute-btn {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
      }
      .cute-btn:hover {
        transform: scale(1.05); /* Se agranda un poquito de forma tierna */
        background: linear-gradient(90deg, #ff007f, #fffb00) !important; /* Invierte el degradado */
        box-shadow: 0 0 35px #ff007f, 0 0 15px #fffb00 !important; /* Brillo doble extremo */
        cursor: pointer;
      }
    `
    document.head.appendChild(styleTag)
  }, [])

  async function fetchData() {

    const { data, error } = await supabase
    .from('e14_forms')
    .select(`
        id,
        table_id,
        candidate_a_votes,
        candidate_b_votes,
        blank_votes,
        null_votes,
        polling_tables!inner (
        registered_voters
        )
    `)

    if (error) {
    console.log(error)
    return
    }

    console.log(data)

    setTables(data)
  }

  function runAudit() {

    const fraudulentTables = tables.filter((table) => {
  
      const totalVotes =
        table.candidate_a_votes +
        table.candidate_b_votes +
        table.blank_votes +
        table.null_votes
  
      return (
        totalVotes >
        table.polling_tables.registered_voters
      )
    })
  
    alert(
      `TOTAL DE MESAS FRAUDULENTAS: ${fraudulentTables.length}`
    )
  }

  return (
    <div style={styles.container}>
  
      <h1 style={styles.title}>
        E-14 FORENSIC ENGINE
      </h1>
  
      <p style={styles.subtitle}>
        SISTEMA DE MONITOREO / DETECCIÓN DE FRAUDE ELECTORAL EN TIEMPO REAL
      </p>
  
      <div style={styles.dashboard}>
  
        {tables.map((table) => {
  
          const totalVotes =
            table.candidate_a_votes +
            table.candidate_b_votes +
            table.blank_votes +
            table.null_votes
  
          const limit =
            table.polling_tables.registered_voters
  
          const fraud =
            totalVotes > limit
  
          return (
  
            <div
              key={table.id}
              className={fraud ? "cute-card-fraud" : "cute-card"}
              style={{
                ...styles.card,
  
                ...(fraud
                  ? styles.cardFraud
                  : {})
              }}
            >
  
              <h2 style={styles.tableTitle}>
                TABLA #{table.table_id}
              </h2>
  
              <p style={styles.text}>
                TOTAL VOTOS: {totalVotes}
              </p>
  
              <p style={styles.text}>
                LIMITE LEGAL: {limit}
              </p>
  
              <p style={styles.text}>
                ESTADO:
              </p>
  
              {fraud ? (
  
                <p style={styles.alert}>
                  ⚠ FRAUDE ELECTORAL DETECTADO
                </p>
  
              ) : (
  
                <p style={styles.statusSafe}>
                  ✔ TABLA VERIFICADA
                </p>
  
              )}
  
            </div>
          )
        })}
  
      </div>
  
      <div style={styles.buttonContainer}>
  
        <button
          className="cute-btn" // Activamos el efecto hover en el botón
          style={styles.button}
          onClick={runAudit}
        >
           RUN FORENSIC AUDIT
        </button>
  
      </div>

      <div style={styles.watermark}>
        by laurinqa
      </div>
  
    </div>
  )
}

const styles = {

  container: {
    background:
      'radial-gradient(circle at top, #1c020f 0%, #080004 80%)',

    minHeight: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
    padding: '40px 20px',
    position: 'relative',

    color: '#fffcaa',

    fontFamily: "'Orbitron', 'Courier New', monospace",
    
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  title: {
    color: '#ff007f',

    textAlign: 'center',

    fontSize: '36px',

    letterSpacing: '5px',

    textShadow: '0 0 15px #ff007f, 0 0 30px #ff007f',

    marginBottom: '10px',
    fontWeight: '900'
  },

  subtitle: {
    textAlign: 'center',

    // Amarillo pollito ultra brillante con más brillo neón propio
    color: '#fffb00',

    marginBottom: '50px',

    opacity: 0.9,
    fontSize: '12px',
    letterSpacing: '2px',
    maxWidth: '600px',
    textShadow: '0 0 10px #fffb00, 0 0 20px rgba(255, 251, 0, 0.3)'
  },

  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', 

    gap: '25px',
    width: '100%',
    maxWidth: '850px', 
    justifyContent: 'center'
  },

  card: {
    backgroundColor: '#0d0107',

    // Pasamos a un amarillo pollito neón más puro (#fffb00)
    border: '2px solid #fffb00',

    borderRadius: '20px',

    padding: '25px',
    
    boxSizing: 'border-box',

    // Incrementamos el brillo base de la tarjeta
    boxShadow:
      '0 0 18px rgba(255, 251, 0, 0.25), inset 0 0 8px rgba(255, 251, 0, 0.05)',

    transition: '0.3s'
  },

  cardFraud: {
    border: '2px solid #ff007f',

    boxShadow:
      '0 0 25px rgba(255, 0, 127, 0.6), inset 0 0 10px rgba(255, 0, 127, 0.1)'
  },

  tableTitle: {
    color: '#ff007f',

    marginBottom: '15px',

    fontSize: '20px',
    letterSpacing: '1px'
  },

  text: {
    marginBottom: '12px',

    color: '#fffdf0',
    fontSize: '14px',
    letterSpacing: '1px'
  },

  statusSafe: {
    marginTop: '15px',

    // Texto de verificación súper neón amarillo
    color: '#fffb00',

    fontWeight: 'bold',
    
    textShadow: '0 0 12px #fffb00'
  },

  alert: {
    marginTop: '15px',

    color: '#ff0055',

    fontWeight: 'bold',

    textShadow: '0 0 15px #ff0055'
  },

  buttonContainer: {
    display: 'flex',

    justifyContent: 'center',

    marginTop: '50px',
    width: '100%'
  },

  button: {
    // Gradiente renovado con el nuevo amarillo vibrante
    background:
      'linear-gradient(90deg, #fffb00, #ff007f)',

    color: '#080004',

    border: 'none',

    padding: '18px 45px',

    fontWeight: 'bold',

    fontSize: '16px',

    borderRadius: '30px',

    letterSpacing: '2px',
    fontFamily: "'Orbitron', 'Courier New', monospace",

    // Brillo base del botón más denso
    boxShadow:
      '0 0 25px rgba(255, 0, 127, 0.5), 0 0 10px rgba(255, 251, 0, 0.3)',

    transition: '0.3s'
  },

  watermark: {
    position: 'fixed',
    bottom: '15px',
    right: '20px',
    color: '#ff007f',
    opacity: 0.15, 
    fontSize: '11px',
    letterSpacing: '2px',
    pointerEvents: 'none', 
    userSelect: 'none'
  }
}