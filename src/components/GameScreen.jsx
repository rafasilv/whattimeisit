import { useState, useEffect, useCallback, useRef } from 'react'
import AnalogClock from './AnalogClock'
import './GameScreen.css'
import wrongAnswerSound from '../assets/wrong-answer.mp3'
import correctAnswerSound from '../assets/correct-answer.wav'
import gameOverSound from '../assets/gameover.wav'
import congratulationsSound from '../assets/congratulations.mp3'
import ticTacSound from '../assets/tic-tac.mp3'
import clickSound from '../assets/click.wav'

function GameScreen({ hero, onGameOver, onRestart, onExit }) {
  const [currentHour, setCurrentHour] = useState(0)
  const [currentMinute, setCurrentMinute] = useState(0)
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [lives, setLives] = useState(5)
  const [timeLeft, setTimeLeft] = useState(60) // 1 minuto em segundos
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false) // Se completou 20 perguntas
  const [showFeedback, setShowFeedback] = useState(false) // Mostrar feedback de resposta
  const [feedbackType, setFeedbackType] = useState(null) // 'correct' ou 'wrong'
  const [isProcessing, setIsProcessing] = useState(false) // Se está processando resposta
  const [showTimeOver, setShowTimeOver] = useState(false) // Mostrar alerta de tempo esgotado
  const [responseTimes, setResponseTimes] = useState([]) // Tempos de resposta para respostas corretas
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0) // Número de respostas corretas
  const [showExitConfirmation, setShowExitConfirmation] = useState(false) // Mostrar confirmação de saída
  const MAX_QUESTIONS = 20

  // Referências para os sons
  const wrongAnswerAudio = useRef(new Audio(wrongAnswerSound))
  const correctAnswerAudio = useRef(new Audio(correctAnswerSound))
  const gameOverAudio = useRef(new Audio(gameOverSound))
  const congratulationsAudio = useRef(new Audio(congratulationsSound))
  const ticTacAudio = useRef(new Audio(ticTacSound))
  const clickAudio = useRef(new Audio(clickSound))

  // Função para tocar som de clique
  const playClickSound = useCallback(() => {
    clickAudio.current.currentTime = 0
    clickAudio.current.play().catch(err => console.log('Erro ao tocar som de clique:', err))
  }, [])

  // Gerar um novo horário (horas 1-12, minutos múltiplos de 5)
  const generateNewTime = useCallback(() => {
    const hour = Math.floor(Math.random() * 12) + 1 // 1-12
    const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
    const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)]
    
    // Para o relógio analógico, usar 0-11 internamente
    const clockHour = hour === 12 ? 0 : hour
    
    setCurrentHour(clockHour)
    setCurrentMinute(minute)
    
    // Formatar horário correto (horas 1-12)
    const correctTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    setCorrectAnswer(correctTime)
    
    // Gerar 4 opções (1 correta + 3 incorretas)
    const wrongOptions = []
    while (wrongOptions.length < 3) {
      const wrongHour = Math.floor(Math.random() * 12) + 1 // 1-12
      const wrongMinute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)]
      const wrongTime = `${wrongHour.toString().padStart(2, '0')}:${wrongMinute.toString().padStart(2, '0')}`
      
      // Garantir que não seja igual à resposta correta
      if (wrongTime !== correctTime && !wrongOptions.includes(wrongTime)) {
        wrongOptions.push(wrongTime)
      }
    }
    
    // Misturar opções
    const allOptions = [correctTime, ...wrongOptions]
    const shuffled = allOptions.sort(() => Math.random() - 0.5)
    setOptions(shuffled)
  }, [])

  // Calcular pontuação baseada no tempo restante
  const calculateScore = useCallback((timeRemaining) => {
    // 500 pontos no início, 0 no final (linear)
    return Math.floor((timeRemaining / 60) * 500)
  }, [])

  // Tratar resposta errada
  const handleWrongAnswer = useCallback(() => {
    setLives((prevLives) => {
      const newLives = prevLives - 1

      if (newLives <= 0) {
        // Game Over
        // Tocar som de game over
        gameOverAudio.current.currentTime = 0
        gameOverAudio.current.play().catch(err => console.log('Erro ao tocar som:', err))
        
        setGameOver(true)
        setScore((prevScore) => {
          if (onGameOver) {
            onGameOver(prevScore)
          }
          return prevScore
        })
      } else {
        // Continuar jogo
        setTimeLeft(60) // Resetar cronômetro
        generateNewTime() // Nova pergunta
      }

      return newLives
    })
  }, [generateNewTime, onGameOver])

  // Iniciar jogo
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
      generateNewTime()
    }
  }, [gameStarted, generateNewTime])

  // Tocar som tic-tac durante o jogo
  useEffect(() => {
    if (gameOver || !gameStarted || showFeedback || isProcessing || showTimeOver) {
      // Parar som quando jogo terminar, feedback aparecer, processando resposta ou tempo esgotado
      ticTacAudio.current.pause()
      ticTacAudio.current.currentTime = 0
      return
    }

    // Tocar som tic-tac em loop
    ticTacAudio.current.loop = true
    ticTacAudio.current.volume = 0.5
    ticTacAudio.current.play().catch(err => console.log('Erro ao tocar som tic-tac:', err))

    // Cleanup: parar som quando componente desmontar ou condições mudarem
    return () => {
      ticTacAudio.current.pause()
      ticTacAudio.current.currentTime = 0
    }
  }, [gameOver, gameStarted, showFeedback, isProcessing, showTimeOver])

  // Cronômetro
  useEffect(() => {
    if (gameOver || !gameStarted || showFeedback || showTimeOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Tempo acabou - mostrar alerta e tocar som de resposta errada
          wrongAnswerAudio.current.currentTime = 0
          wrongAnswerAudio.current.play().catch(err => console.log('Erro ao tocar som:', err))
          setShowTimeOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver, gameStarted, showFeedback, showTimeOver])

  // Verificar resposta
  const handleAnswer = (selectedTime) => {
    if (gameOver || isProcessing) return

    // Tocar som de clique
    playClickSound()

    // Parar som tic-tac quando usuário escolher resposta
    ticTacAudio.current.pause()
    ticTacAudio.current.currentTime = 0

    setIsProcessing(true)
    const timeRemaining = timeLeft
    const pointsEarned = calculateScore(timeRemaining)

    if (selectedTime === correctAnswer) {
      // Resposta correta
      // Tocar som de resposta correta
      correctAnswerAudio.current.currentTime = 0
      correctAnswerAudio.current.play().catch(err => console.log('Erro ao tocar som:', err))
      
      // Calcular tempo de resposta (60 - timeRemaining)
      const responseTime = 60 - timeRemaining
      
      // Adicionar tempo de resposta e incrementar contador de respostas corretas
      setResponseTimes((prev) => [...prev, responseTime])
      setCorrectAnswersCount((prev) => prev + 1)
      
      setFeedbackType('correct')
      setShowFeedback(true)
      
      setScore((prev) => {
        const newScore = prev + pointsEarned
        setQuestionsAnswered((prevCount) => {
          const newCount = prevCount + 1
          
          // Verificar se completou 20 perguntas
          if (newCount >= MAX_QUESTIONS) {
            setTimeout(() => {
              // Adicionar pontos extras baseados nas vidas restantes (500 pontos por vida)
              const bonusPoints = lives * 500
              const finalScore = newScore + bonusPoints
              
              // Tocar som de congratulations
              congratulationsAudio.current.currentTime = 0
              congratulationsAudio.current.play().catch(err => console.log('Erro ao tocar som:', err))
              
              setScore(finalScore)
              setGameCompleted(true)
              setGameOver(true)
              if (onGameOver) {
                onGameOver(finalScore)
              }
            }, 1500)
            return newCount
          }
          
          // Continuar jogo após feedback
          setTimeout(() => {
            setTimeLeft(60) // Resetar cronômetro
            generateNewTime() // Nova pergunta
            setShowFeedback(false)
            setFeedbackType(null)
            setIsProcessing(false)
            // Som tic-tac será retomado automaticamente pelo useEffect
          }, 1500)
          return newCount
        })
        return newScore
      })
    } else {
      // Resposta incorreta
      // Tocar som de resposta errada
      wrongAnswerAudio.current.currentTime = 0
      wrongAnswerAudio.current.play().catch(err => console.log('Erro ao tocar som:', err))
      
      setFeedbackType('wrong')
      setShowFeedback(true)
      // Não processar erro automaticamente - esperar botão OK
    }
  }

  // Continuar após erro (chamado pelo botão OK)
  const handleContinueAfterError = () => {
    // Tocar som de clique
    playClickSound()
    
    setShowFeedback(false)
    setFeedbackType(null)
    handleWrongAnswer()
    setIsProcessing(false)
  }

  // Continuar após tempo esgotado (chamado pelo botão Go on!)
  const handleContinueAfterTimeOver = () => {
    // Tocar som de clique
    playClickSound()
    
    setShowTimeOver(false)
    handleWrongAnswer()
  }

  // Renderizar corações
  const renderHearts = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`heart ${i < lives ? 'active' : 'inactive'}`}>
        ❤️
      </span>
    ))
  }

  // Formatar tempo
  const formatTime = (seconds) => {
    return `${seconds.toString().padStart(2, '0')}s`
  }

  // Abrir confirmação de saída
  const handleExitClick = () => {
    playClickSound()
    setShowExitConfirmation(true)
  }

  // Confirmar saída
  const handleConfirmExit = () => {
    playClickSound()
    // Parar som tic-tac
    ticTacAudio.current.pause()
    ticTacAudio.current.currentTime = 0
    if (onExit) {
      onExit()
    }
  }

  // Cancelar saída
  const handleCancelExit = () => {
    playClickSound()
    setShowExitConfirmation(false)
  }

  return (
    <div className="game-screen">
      <button 
        className="exit-button"
        onClick={handleExitClick}
        disabled={gameOver || showFeedback || showTimeOver}
      >
        ✕
      </button>
      <div className="game-header">
        <div className="lives-container">
          <div className="hero-info">
            {hero && hero.avatar && (
              <img 
                src={hero.avatar} 
                alt={hero.name}
                className="hero-avatar-small"
              />
            )}
            {hero && (
              <span className="hero-name">{hero.name}</span>
            )}
          </div>
          {renderHearts()}
        </div>
        <div className="timer-container">
          <span className="timer-label">Time:</span>
          <span className="timer-value">{formatTime(timeLeft)}</span>
        </div>
        <div className="score-container">
          <span className="score-label">Points:</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="questions-container">
          <span className="questions-label">Question:</span>
          <span className="questions-value">{questionsAnswered}/{MAX_QUESTIONS}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="clock-container">
          <AnalogClock
            size={300}
            hourSpeed={999999} // Parar animação
            minuteSpeed={999999} // Parar animação
            initialHour={currentHour}
            initialMinute={currentMinute}
            color="#d4af37"
            staticClock={true}
          />
        </div>

        <div className="question-container">
          <h2 className="question-text">What time is it?</h2>
        </div>

        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${isProcessing ? 'disabled' : ''}`}
              onClick={() => handleAnswer(option)}
              disabled={gameOver || isProcessing}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`feedback-overlay ${feedbackType}`}>
          <div className="feedback-content">
            {feedbackType === 'correct' ? (
              <>
                <div className="feedback-icon">✓</div>
                <h2 className="feedback-title">Correct!</h2>
                <p className="feedback-message">Good answer!</p>
              </>
            ) : (
              <>
                <div className="feedback-icon">✗</div>
                <h2 className="feedback-title">Wrong!</h2>
                <div className="feedback-clock-container">
                  <AnalogClock
                    size={250}
                    hourSpeed={999999}
                    minuteSpeed={999999}
                    initialHour={currentHour}
                    initialMinute={currentMinute}
                    color="#d4af37"
                    staticClock={true}
                  />
                </div>
                <div className="correct-answer-badge">
                  Right Answer: {correctAnswer}
                </div>
                <button className="feedback-ok-button" onClick={handleContinueAfterError}>
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showTimeOver && (
        <div className="time-over-overlay">
          <div className="time-over-content">
            <div className="time-over-icon">⏰</div>
            <h2 className="time-over-title">Time is over!</h2>
            <p className="time-over-message">You ran out of time!</p>
            <button className="time-over-button" onClick={handleContinueAfterTimeOver}>
              Go on!
            </button>
          </div>
        </div>
      )}

      {showExitConfirmation && (
        <div className="exit-confirmation-overlay">
          <div className="exit-confirmation-content">
            <h2 className="exit-confirmation-title">Exit Game?</h2>
            <p className="exit-confirmation-message">Are you sure you want to exit? Your progress will be lost.</p>
            <div className="exit-confirmation-buttons">
              <button className="exit-confirm-button" onClick={handleConfirmExit}>
                Yes
              </button>
              <button className="exit-cancel-button" onClick={handleCancelExit}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            {!gameCompleted && hero && hero.gameOverVideo && (
              <video
                className="game-over-video"
                src={hero.gameOverVideo}
                autoPlay
                muted
                loop
              />
            )}
            {gameCompleted && hero && hero.video && (
              <video
                className="game-over-video"
                src={hero.video}
                autoPlay
                muted
                loop
              />
            )}
            <h2 className="game-over-title">
              {gameCompleted ? 'Congratulations!' : 'Game Over!'}
            </h2>
            {gameCompleted && (
              <>
                <p className="completion-message">You completed all 20 questions!</p>
                <div className="score-breakdown">
                  {(() => {
                    // Calcular tempo médio de resposta
                    const avgResponseTime = responseTimes.length > 0
                      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
                      : 0
                    
                    // Calcular pontos por tempo médio (usando a mesma fórmula: (60 - avgTime) / 60 * 500)
                    const timeBasedPoints = responseTimes.length > 0
                      ? Math.floor(((60 - avgResponseTime) / 60) * 500) * correctAnswersCount
                      : 0
                    
                    // Pontos por vida
                    const lifeBonusPoints = lives * 500
                    
                    return (
                      <>
                        <div className="breakdown-item">
                          <span className="breakdown-label">Average response time:</span>
                          <span className="breakdown-value">{avgResponseTime}s</span>
                        </div>
                        <div className="breakdown-item">
                          <span className="breakdown-label">Correct answers:</span>
                          <span className="breakdown-value">{correctAnswersCount}</span>
                        </div>
                        <div className="breakdown-item">
                          <span className="breakdown-label">Time-based points:</span>
                          <span className="breakdown-value">{timeBasedPoints.toLocaleString()}</span>
                        </div>
                        <div className="breakdown-item">
                          <span className="breakdown-label">Life bonus ({lives} lives × 500):</span>
                          <span className="breakdown-value">{lifeBonusPoints.toLocaleString()}</span>
                        </div>
                        <div className="breakdown-total">
                          <span className="breakdown-label">Total Score:</span>
                          <span className="breakdown-value">{score.toLocaleString()}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </>
            )}
            {!gameCompleted && (
              <p className="final-score">Final Score: {score.toLocaleString()}</p>
            )}
            <button 
              className="restart-button" 
              onClick={() => {
                playClickSound()
                onRestart()
              }}
            >
              {gameCompleted ? 'Play Again' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameScreen

