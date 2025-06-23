// import { useState } from 'react'
import { useState, useRef } from 'react'
import './css/app.css'
import { Board } from './Board'
import { Platform } from './Platform'
import { Navigation } from './Navigation'

function App() {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isGameMode, setIsGameMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
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
          </>
        )}
      </div>
    </div>
  )
}

export default App