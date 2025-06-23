import React, { useState, useEffect, useRef } from 'react';
import './css/board.css'; 

const FONT = {
  'C': [' 111', '1   ', '1   ', '1   ', ' 111'],
  'H': ['1  1', '1  1', '1111', '1  1', '1  1'],
  'A': [' 11 ', '1  1', '1111', '1  1', '1  1'],
  'S': [' 111', '1   ', ' 11 ', '   1', '111 '],
  'E': ['1111', '1   ', '111 ', '1   ', '1111'],
  'R': ['111 ', '1  1', '111 ', '1  1', '1  1'],
  'Y': ['1  1', ' 11 ', '  1 ', '  1 ', ' 11 '],
  'N': ['1  1', '11 1', '1 11', '1  1', '1  1'],
  'D': ['111 ', '1  1', '1  1', '1  1', '111 '],
  ' ': ['    ', '    ', '    ', '    ', '    '],
};
const FONT_HEIGHT = 5;
const LETTER_SPACING = 1;

export const Board = ({ 
  onNavigationVisibilityChange, 
  onGameModeChange, 
  isPlaying, 
  onPausePlay, 
  onReset,
  resetBoardRef,
  spaceshipsRef
}) => {
  const [gridDim, setGridDim] = useState({ width: 0, height: 0 });
  const [clickedSquares, setClickedSquares] = useState(new Set());
  const [tileTypes, setTileTypes] = useState({}); // Track random tile types
  const [initialClickedSquares, setInitialClickedSquares] = useState(new Set()); // Store initial state
  const intervalRef = useRef(null); // Ref to hold interval ID
  const gridRef = useRef(null);

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const resizeObserver = new ResizeObserver(() => {
      const style = window.getComputedStyle(gridEl);
      const newWidth = style.gridTemplateColumns.split(' ').length;
    //   const newHeight = style.gridTemplateRows.split(' ').length;
      setGridDim({ width: newWidth, height: 13 });
    });

    resizeObserver.observe(gridEl);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (gridDim.width === 0 || gridDim.height === 0) return;

    const { width, height } = gridDim;
    const newClickedSquares = new Set();
    const newTileTypes = {};
    let text = "CHASE REYNDERS";
    console.log(gridDim.width);
    if (gridDim.width < 78) { 
        text = "CHASE R";
    }
    if (gridDim.width < 45) {
        text = "CHASE";
    }
    if (gridDim.width < 30) {
        text = "CR";
    }

    const borderSize = 2;

    // Generate random tile types for all squares
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const key = `${i}-${j}`;
        const random = Math.random();
        if (random < 0.33) {
          newTileTypes[key] = 'mosaic-tile-1';
        } else if (random < 0.66) {
          newTileTypes[key] = 'mosaic-tile-2';
        } else {
          newTileTypes[key] = 'mosaic-tile-3';
        }
      }
    }

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const isBorder = i < borderSize || i >= width - borderSize || j < borderSize || j >= height - borderSize;
        if (isBorder && (i + j) % 2 === 1) {
          newClickedSquares.add(`${i}-${j}`);
        }
      }
    }

    const textPattern = text.toUpperCase().split('').map(char => FONT[char]).filter(Boolean);
    const totalTextWidth = textPattern.reduce((sum, letter) => sum + letter[0].length + LETTER_SPACING, 0) - LETTER_SPACING;
    const contentWidth = width - borderSize * 2;
    const contentHeight = height - borderSize * 2;

    if (totalTextWidth <= contentWidth && FONT_HEIGHT <= contentHeight) {
      const startX = Math.floor((contentWidth - totalTextWidth) / 2) + borderSize;
      const startY = Math.floor((contentHeight - FONT_HEIGHT) / 2) + borderSize;

      let currentX = startX;
      textPattern.forEach(letter => {
        const letterWidth = letter[0].length;
        for (let j = 0; j < FONT_HEIGHT; j++) {
          for (let i = 0; i < letterWidth; i++) {
            if (letter[j][i] === '1') {
              newClickedSquares.add(`${currentX + i}-${startY + j}`);
            }
          }
        }
        currentX += letterWidth + LETTER_SPACING;
      });
    }

    setClickedSquares(newClickedSquares);
    setInitialClickedSquares(new Set(newClickedSquares)); // Store initial state
    setTileTypes(newTileTypes);
  }, [gridDim]);

  const handleStep = () => {
    const { width, height } = gridDim;
    if (width === 0 || height === 0) return;

    setClickedSquares(prevClickedSquares => {
      const nextLivingCells = new Set(prevClickedSquares);
      const getWrappedIndex = (index, maxIndex) => (index + maxIndex) % maxIndex;

      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const key = `${i}-${j}`;
          const isAlive = prevClickedSquares.has(key);
          let livingNeighbors = 0;

          for (let dj = -1; dj <= 1; dj++) {
            for (let di = -1; di <= 1; di++) {
              if (di === 0 && dj === 0) continue;
              const neighborI = getWrappedIndex(i + di, width);
              const neighborJ = getWrappedIndex(j + dj, height);
              if (prevClickedSquares.has(`${neighborI}-${neighborJ}`)) {
                livingNeighbors++;
              }
            }
          }

          if (isAlive) {
            if (livingNeighbors < 2 || livingNeighbors > 3) {
              nextLivingCells.delete(key);
            }
          } else {
            if (livingNeighbors === 3) {
              nextLivingCells.add(key);
            }
          }
        }
      }
      return nextLivingCells;
    });
  };

  // Function to reset the board
  const resetBoard = () => {
    setClickedSquares(new Set(initialClickedSquares));
    onReset();
  };

  // Function to create spaceships
  const createSpaceships = () => {
    const { width, height } = gridDim;
    if (width === 0 || height === 0) return;

    const newClickedSquares = new Set();
    
    // Correct MWSS pattern
    const mwss = [
      [0,0,0,0,0,0],
      [0,0,0,1,1,0],
      [1,1,1,0,1,1],
      [1,1,1,1,1,0],
      [0,1,1,1,0,0]
    ];
    // Define a glider
    const glider = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ];
    // Define a lightweight spaceship (LWSS)
    const lwss = [
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0]
    ];

    // Place MWSS at left
    const mwssX = 3, mwssY = 4;
    for (let j = 0; j < mwss.length; j++) {
      for (let i = 0; i < mwss[j].length; i++) {
        if (mwss[j][i] === 1) {
          const x = mwssX + i;
          const y = mwssY + j;
          if (x >= 0 && x < width && y >= 0 && y < height) {
            newClickedSquares.add(`${x}-${y}`);
          }
        }
      }
    }
    // Place glider at bottom right
    const gliderX = width - 8, gliderY = height - 8;
    for (let j = 0; j < glider.length; j++) {
      for (let i = 0; i < glider[j].length; i++) {
        if (glider[j][i] === 1) {
          const x = gliderX + i;
          const y = gliderY + j;
          if (x >= 0 && x < width && y >= 0 && y < height) {
            newClickedSquares.add(`${x}-${y}`);
          }
        }
      }
    }
    // Place LWSS in the middle
    const lwssX = Math.floor(width / 2) - 2;
    const lwssY = Math.floor(height / 2) - 2;
    for (let j = 0; j < lwss.length; j++) {
      for (let i = 0; i < lwss[j].length; i++) {
        if (lwss[j][i] === 1) {
          const x = lwssX + i;
          const y = lwssY + j;
          if (x >= 0 && x < width && y >= 0 && y < height) {
            newClickedSquares.add(`${x}-${y}`);
          }
        }
      }
    }
    setClickedSquares(newClickedSquares);
    setIsPlaying(false);
  };

  // Expose reset function to parent component
  useEffect(() => {
    if (resetBoardRef) {
      resetBoardRef.current = resetBoard;
    }
  }, [resetBoardRef, initialClickedSquares]);

  // Expose spaceships function to parent component
  useEffect(() => {
    if (spaceshipsRef) {
      spaceshipsRef.current = createSpaceships;
    }
  }, [spaceshipsRef, gridDim]);

  // UseEffect to handle animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(handleStep, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, handleStep]);
  
  const handleSquareClick = (key) => {
    const newClickedSquares = new Set(clickedSquares);
    if (newClickedSquares.has(key)) {
        newClickedSquares.delete(key);
    } else {
        newClickedSquares.add(key);
    }
    setClickedSquares(newClickedSquares);
  };

  const renderGrid = () => {
    const { width, height } = gridDim;
    const squares = [];
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const key = `${i}-${j}`;
            const isClicked = clickedSquares.has(key);
            const tileType = tileTypes[key] || 'black-tile';
            squares.push(
                <div
                    key={key}
                    className={`square ${tileType} ${isClicked ? 'clicked' : ''}`}
                    onClick={() => handleSquareClick(key)}
                ></div>
            );
        }
    }
    return squares;
  }

  return (
    <div>
      <div className="grid-container">
        <div className="grid" ref={gridRef}>
          {renderGrid()}
        </div>
      </div>
    </div>
  );
};