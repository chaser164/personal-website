// import { useState } from 'react'
import { useState, useRef } from 'react'
import './css/app.css'
import { Board } from './Board'
import { Platform } from './Platform'
import { Navigation } from './Navigation'
import subwayImg from './assets/subway.png';

function App() {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isGameMode, setIsGameMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showTrain, setShowTrain] = useState(false);
  const resetBoardRef = useRef(null);
  const spaceshipsRef = useRef(null);

  const handleNavigationVisibilityChange = (isVisible) => {
    setIsNavigationVisible(isVisible);
  };

  const handleGameModeChange = (gameMode, playing, exiting) => {
    setIsGameMode(gameMode);
    setIsPlaying(playing);
    setIsExiting(exiting);
  };

  const handlePausePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (resetBoardRef.current) {
      resetBoardRef.current();
    }
    setIsPlaying(false);
  };

  const handleSpaceships = () => {
    if (spaceshipsRef.current) {
      spaceshipsRef.current();
    }
  };

  const handleTrainTime = () => {
    setShowTrain(false); // reset if already running
    setTimeout(() => setShowTrain(true), 10); // trigger reflow for animation
  };

  return (
    <div className="app-container">
      <div className="left-wall">
        <img src="/src/assets/left_column.png" alt="Left Wall" />
      </div>
      <div className="main-content">
        <Board 
          onNavigationVisibilityChange={handleNavigationVisibilityChange}
          onGameModeChange={handleGameModeChange}
          isPlaying={isPlaying}
          onPausePlay={handlePausePlay}
          onReset={handleReset}
          resetBoardRef={resetBoardRef}
          spaceshipsRef={spaceshipsRef}
        />
        <Platform />
      </div>
      <div className="right-wall">
        <img src="/src/assets/right_column.png" alt="Right Wall" />
      </div>
      <Navigation isVisible={isNavigationVisible} />
      
      {/* Game mode buttons - moved outside main-content */}
      <div className="game-controls">
        <button 
          className={`main-button ${isGameMode ? 'game-mode' : ''}`}
          onClick={() => {
            if (!isGameMode) {
              handleGameModeChange(true, true, false);
              handleNavigationVisibilityChange(false);
            } else {
              // Set exiting state to trigger animations
              handleGameModeChange(false, false, true);
              // Immediately start fading navigation back in
              handleNavigationVisibilityChange(true); 

              // After animation, hide the buttons
              setTimeout(() => {
                handleGameModeChange(false, false, false);
              }, 1000);
            }
          }}
        >
          {isGameMode ? "Done" : "Game of Life"}
        </button>
        {(isGameMode || isExiting) && (
          <>
            <button 
              className={`control-button reset-button ${isExiting ? 'slide-out' : ''}`}
              onClick={handleReset}
              disabled={isExiting}
            >
              Reset
            </button>
            <button 
              className={`control-button spaceships-button ${isExiting ? 'slide-out' : ''}`}
              onClick={handleSpaceships}
              disabled={isExiting}
            >
              Spaceships
            </button>
            <button 
              className={`control-button pause-play-button ${isExiting ? 'slide-out' : ''}`}
              onClick={handlePausePlay}
              disabled={isExiting}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button 
              className={`control-button about-button ${isExiting ? 'slide-out' : ''}`}
              onClick={() => window.open('https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life', '_blank', 'noopener noreferrer')}
              disabled={isExiting}
            >
              About
            </button>
          </>
        )}
      </div>
      <div className="train-time-container">
        <button className="train-time-button" onClick={handleTrainTime}>
          Train Time
        </button>
      </div>
      {showTrain && (
        <img
          src={subwayImg}
          alt="Train"
          className="train-animation"
          onAnimationEnd={() => setShowTrain(false)}
        />
      )}
    </div>
  )
}

export default App