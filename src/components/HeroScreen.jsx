import { useRef, useEffect } from 'react'
import './HeroScreen.css'
import clickSound from '../assets/click.wav'
import letsGoSound from '../assets/letsgo.wav'

function HeroScreen({ hero, onConfirm }) {
  const clickAudio = useRef(new Audio(clickSound))
  const letsGoAudio = useRef(new Audio(letsGoSound))

  // Tocar som "let's go" quando o componente for montado
  useEffect(() => {
    if (hero) {
      letsGoAudio.current.volume = 0.7
      letsGoAudio.current.play().catch(err => console.log('Erro ao tocar som let\'s go:', err))
    }

    // Cleanup: pausar som quando componente desmontar
    return () => {
      letsGoAudio.current.pause()
      letsGoAudio.current.currentTime = 0
    }
  }, [hero])

  if (!hero) return null

  const handleConfirm = () => {
    clickAudio.current.currentTime = 0
    clickAudio.current.play().catch(err => console.log('Erro ao tocar som de clique:', err))
    onConfirm()
  }

  return (
    <div className="hero-screen">
      <div className="hero-ready-container">
        {hero.avatar && (
          <img 
            src={hero.avatar} 
            alt={hero.name}
            className="hero-ready-avatar"
          />
        )}
        <h1 className="hero-screen-title">{hero.name} is ready...</h1>
      </div>
      <button className="confirm-hero-button" onClick={handleConfirm}>
        Start!
      </button>
    </div>
  )
}

export default HeroScreen

