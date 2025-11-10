import { useRef } from 'react'
import './HomeScreen.css'
import AnalogClock from './AnalogClock'
import clickSound from '../assets/click.wav'

function HomeScreen({ onStartClick }) {
  const clickAudio = useRef(new Audio(clickSound))

  const handleStartClick = () => {
    clickAudio.current.currentTime = 0
    clickAudio.current.play().catch(err => console.log('Erro ao tocar som de clique:', err))
    onStartClick()
  }

  return (
    <div className="home-screen">
      <div className="background-clocks">
        {/* Relógios decorativos com diferentes velocidades e posições */}
        <div className="clock-wrapper clock-1">
          <AnalogClock 
            size={200}
            hourSpeed={8}
            minuteSpeed={1.5}
            initialHour={1}
            initialMinute={30}
            color="#4a9eff"
          />
        </div>
        <div className="clock-wrapper clock-2">
          <AnalogClock 
            size={150}
            hourSpeed={12}
            minuteSpeed={2}
            initialHour={2}
            initialMinute={45}
            color="#ff6b47"
          />
        </div>
        <div className="clock-wrapper clock-3">
          <AnalogClock 
            size={180}
            hourSpeed={10}
            minuteSpeed={1.8}
            initialHour={3}
            initialMinute={15}
            color="#40e0d0"
          />
        </div>
        <div className="clock-wrapper clock-4">
          <AnalogClock 
            size={120}
            hourSpeed={15}
            minuteSpeed={2.5}
            initialHour={4}
            initialMinute={0}
            color="#ffa500"
          />
        </div>
        <div className="clock-wrapper clock-5">
          <AnalogClock 
            size={100}
            hourSpeed={9}
            minuteSpeed={1.6}
            initialHour={5}
            initialMinute={20}
            color="#9d4edd"
          />
        </div>
        
        {/* Relógios menores (antigos círculos decorativos) */}
        <div className="clock-wrapper circle-1">
          <AnalogClock 
            size={46}
            hourSpeed={20}
            minuteSpeed={3}
            initialHour={6}
            initialMinute={0}
            color="#ff6b47"
          />
        </div>
        <div className="clock-wrapper circle-2">
          <AnalogClock 
            size={35}
            hourSpeed={18}
            minuteSpeed={2.5}
            initialHour={7}
            initialMinute={30}
            color="#4a9eff"
          />
        </div>
        <div className="clock-wrapper circle-3">
          <AnalogClock 
            size={40}
            hourSpeed={22}
            minuteSpeed={3.5}
            initialHour={8}
            initialMinute={15}
            color="#40e0d0"
          />
        </div>
        
        {/* Relógios adicionais para mobile */}
        <div className="clock-wrapper mobile-clock-1">
          <AnalogClock 
            size={80}
            hourSpeed={14}
            minuteSpeed={2.2}
            initialHour={9}
            initialMinute={10}
            color="#ffa500"
          />
        </div>
        <div className="clock-wrapper mobile-clock-2">
          <AnalogClock 
            size={70}
            hourSpeed={16}
            minuteSpeed={2.3}
            initialHour={10}
            initialMinute={25}
            color="#9d4edd"
          />
        </div>
        <div className="clock-wrapper mobile-clock-3">
          <AnalogClock 
            size={60}
            hourSpeed={18}
            minuteSpeed={2.4}
            initialHour={11}
            initialMinute={40}
            color="#ff6b47"
          />
        </div>
        <div className="clock-wrapper mobile-clock-4">
          <AnalogClock 
            size={55}
            hourSpeed={20}
            minuteSpeed={2.6}
            initialHour={12}
            initialMinute={5}
            color="#40e0d0"
          />
        </div>
        <div className="clock-wrapper mobile-clock-5">
          <AnalogClock 
            size={65}
            hourSpeed={13}
            minuteSpeed={2.1}
            initialHour={1}
            initialMinute={50}
            color="#ff6b47"
          />
        </div>
        <div className="clock-wrapper mobile-clock-6">
          <AnalogClock 
            size={75}
            hourSpeed={17}
            minuteSpeed={2.4}
            initialHour={2}
            initialMinute={35}
            color="#4a9eff"
          />
        </div>
        <div className="clock-wrapper mobile-clock-7">
          <AnalogClock 
            size={50}
            hourSpeed={19}
            minuteSpeed={2.7}
            initialHour={3}
            initialMinute={20}
            color="#ffa500"
          />
        </div>
        <div className="clock-wrapper mobile-clock-8">
          <AnalogClock 
            size={58}
            hourSpeed={21}
            minuteSpeed={2.8}
            initialHour={4}
            initialMinute={55}
            color="#9d4edd"
          />
        </div>
      </div>

      <h1 className="game-title">What time is it?</h1>
      
      <div className="button-container">
        <button className="start-button" onClick={handleStartClick}>
          Start
        </button>
      </div>
    </div>
  )
}

export default HomeScreen

