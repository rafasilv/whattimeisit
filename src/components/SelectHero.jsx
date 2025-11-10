import { useState, useRef, useEffect } from 'react'
import './SelectHero.css'
import clickSound from '../assets/click.wav'
import selectHeroSound from '../assets/select-hero.wav'
import gigi from '../assets/Gigi.png'
import pedro from '../assets/Pedro.png'
import manu from '../assets/Manu.png'
import duda from '../assets/Duda.png'
import biel from '../assets/biel.png'
import gigiVideo from '../assets/gigi.mp4'
import pedroVideo from '../assets/pedro.mp4'
import manuVideo from '../assets/manu.mp4'
import dudaVideo from '../assets/duda.mp4'
import bielVideo from '../assets/biel.mp4'
import gigiGameOverVideo from '../assets/gigi-gameover.mp4'
import pedroGameOverVideo from '../assets/pedro-gameover.mp4'
import manuGameOverVideo from '../assets/manu-gameover.mp4'
import dudaGameOverVideo from '../assets/duda-gameover.mp4'
import bielGameOverVideo from '../assets/biel-gameover.mp4'

function SelectHero({ onSelectHero }) {
  const [selectedHeroId, setSelectedHeroId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const clickAudio = useRef(new Audio(clickSound))
  const selectHeroAudio = useRef(new Audio(selectHeroSound))

  const playClickSound = () => {
    clickAudio.current.currentTime = 0
    clickAudio.current.play().catch(err => console.log('Erro ao tocar som de clique:', err))
  }

  // Tocar som de seleção de herói quando o componente for montado
  useEffect(() => {
    selectHeroAudio.current.volume = 0.7
    selectHeroAudio.current.play().catch(err => console.log('Erro ao tocar som de seleção de herói:', err))

    // Cleanup: pausar som quando componente desmontar
    return () => {
      selectHeroAudio.current.pause()
      selectHeroAudio.current.currentTime = 0
    }
  }, [])

  // Lista de heróis
  const heroes = [
    {
      id: 1,
      name: 'Gigi',
      avatar: gigi,
      video: gigiVideo,
      gameOverVideo: gigiGameOverVideo
    },
    {
      id: 2,
      name: 'Pedro',
      avatar: pedro,
      video: pedroVideo,
      gameOverVideo: pedroGameOverVideo
    },
    {
      id: 3,
      name: 'Manu',
      avatar: manu,
      video: manuVideo,
      gameOverVideo: manuGameOverVideo
    },
    {
      id: 4,
      name: 'Duda',
      avatar: duda,
      video: dudaVideo,
      gameOverVideo: dudaGameOverVideo
    },
    {
      id: 5,
      name: 'Biel',
      avatar: biel,
      video: bielVideo,
      gameOverVideo: bielGameOverVideo
    }
  ]

  const selectedHero = heroes.find(h => h.id === selectedHeroId)

  const handleHeroClick = (hero) => {
    playClickSound()
    if (hero.video) {
      setSelectedHeroId(hero.id)
      setIsAnimating(true)
    } else {
      // Se não tiver vídeo, chama diretamente
      if (onSelectHero) {
        onSelectHero(hero)
      }
    }
  }

  const handleVideoEnd = () => {
    // Vídeo terminou, mas mantém a tela aberta para o usuário confirmar
  }

  const handleConfirm = () => {
    playClickSound()
    setIsAnimating(false)
    if (selectedHero && onSelectHero) {
      onSelectHero(selectedHero)
    }
  }

  const handleCancel = () => {
    playClickSound()
    setIsAnimating(false)
    setSelectedHeroId(null)
  }

  return (
    <div className="select-hero-screen">
      <h1 className="select-hero-title">Select your hero</h1>
      
      {isAnimating && selectedHero && selectedHero.video && (
        <div className="hero-video-overlay">
          <div className="hero-video-content">
            <h2 className="selected-hero-name">{selectedHero.name}</h2>
            <video
              className="hero-video"
              src={selectedHero.video}
              autoPlay
              muted
              loop
              onEnded={handleVideoEnd}
            />
            <div className="hero-selection-buttons">
              <button className="confirm-button" onClick={handleConfirm}>
                Select
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`heroes-container ${isAnimating ? 'hidden' : ''}`}>
        {heroes.map((hero) => (
          <div 
            key={hero.id} 
            className="hero-card"
            onClick={() => handleHeroClick(hero)}
          >
            <div className="hero-avatar-container">
              <img 
                src={hero.avatar} 
                alt={hero.name}
                className="hero-avatar"
              />
            </div>
            <h3 className="hero-name">{hero.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectHero

