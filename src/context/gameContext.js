import React, { createContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [setGameState, GameState] = useState(null);

  return (
    <GameContext.Provider value={{ GameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;