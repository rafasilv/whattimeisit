import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import SelectHero from './components/SelectHero'
import HeroScreen from './components/HeroScreen'
import GameScreen from './components/GameScreen'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [selectedHero, setSelectedHero] = useState(null)

  const handleStartClick = () => {
    setCurrentScreen('select-hero')
  }

  const handleSelectHero = (hero) => {
    setSelectedHero(hero)
    setCurrentScreen('hero')
  }

  const handleConfirmHero = () => {
    setCurrentScreen('game')
  }

  const handleGameOver = (finalScore) => {
    // Game over - pode adicionar lógica adicional aqui se necessário
    console.log('Game Over! Final Score:', finalScore)
  }

  const handleRestart = () => {
    setCurrentScreen('select-hero')
    setSelectedHero(null)
  }

  const handleExit = () => {
    setCurrentScreen('home')
    setSelectedHero(null)
  }

  return (
    <div className="App">
      {currentScreen === 'home' && (
        <HomeScreen onStartClick={handleStartClick} />
      )}
      {currentScreen === 'select-hero' && (
        <SelectHero onSelectHero={handleSelectHero} />
      )}
      {currentScreen === 'hero' && selectedHero && (
        <HeroScreen hero={selectedHero} onConfirm={handleConfirmHero} />
      )}
      {currentScreen === 'game' && selectedHero && (
        <GameScreen 
          hero={selectedHero} 
          onGameOver={handleGameOver}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App

