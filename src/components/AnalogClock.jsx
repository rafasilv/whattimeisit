import './AnalogClock.css'

function AnalogClock({ size = 200, hourSpeed = 360, minuteSpeed = 60, initialHour = 0, initialMinute = 0, color = '#d4af37', staticClock = false }) {
  // Calcular posição inicial dos ponteiros
  const hourRotation = (initialHour * 30) + (initialMinute * 0.5) // 30 graus por hora, 0.5 por minuto
  const minuteRotation = initialMinute * 6 // 6 graus por minuto

  const isSmall = size < 50
  const isStatic = staticClock || hourSpeed > 99999 || minuteSpeed > 99999
  
  return (
    <div 
      className={`analog-clock ${isSmall ? 'small-clock' : 'large-clock'}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        '--clock-color': color
      }}
    >
      <div className="clock-face">
        {/* Marcações das horas */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30 - 90 // -90 para começar no topo
          const isMain = i % 3 === 0 // Marcações principais a cada 3 horas (12, 3, 6, 9)
          // Ajustar distância das marcações baseado no tamanho
          // Marcações principais devem ficar mais próximas da borda
          const markDistance = size < 50 
            ? (isMain ? 3 : 5)  // Relógios pequenos: principais mais perto da borda
            : (isMain ? 15 : 10) // Relógios grandes: padrão
          return (
            <div
              key={i}
              className={`hour-mark ${isMain ? 'main-mark' : ''}`}
              style={{
                transform: `rotate(${angle}deg) translateY(-${size / 2 - markDistance}px)`
              }}
            />
          )
        })}
        
        {/* Números do relógio (1-12) */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i // 12 no topo, depois 1-11
          const angle = i * 30 - 90 // -90 para começar no topo
          const numberDistance = size * 0.35 // Distância do centro para os números
          const x = Math.cos((angle * Math.PI) / 180) * numberDistance
          const y = Math.sin((angle * Math.PI) / 180) * numberDistance
          
          return (
            <div
              key={`number-${i}`}
              className="clock-number"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                fontSize: `${size * 0.08}px`,
                fontWeight: 'bold',
                color: 'var(--clock-color, #d4af37)',
                textShadow: '0 0 2px rgba(212, 175, 55, 0.5)',
                userSelect: 'none'
              }}
            >
              {hour}
            </div>
          )
        })}
        
        {/* Ponteiro das horas */}
        <div 
          className="hand hour-hand"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourRotation}deg)`,
            animation: isStatic ? 'none' : `rotateHour ${hourSpeed}s linear infinite`
          }}
        />
        
        {/* Ponteiro dos minutos */}
        <div 
          className="hand minute-hand"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)`,
            animation: isStatic ? 'none' : `rotateMinute ${minuteSpeed}s linear infinite`
          }}
        />
        
        {/* Centro do relógio */}
        <div className="clock-center" />
      </div>
    </div>
  )
}

export default AnalogClock

