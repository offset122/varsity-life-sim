import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl } from 'howler';

interface SoundContextType {
  playSFX: (name: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sfx, setSfx] = useState<Record<string, Howl>>({});

  useEffect(() => {
    // Standard game sound effects
    const jumpSound = new Howl({ 
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-player-jumping-in-a-video-game-2043.mp3'],
      volume: 0.4
    });
    const clickSound = new Howl({ 
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-simple-game-click-2244.mp3'],
      volume: 0.5
    });
    
    setSfx({
      jump: jumpSound,
      click: clickSound,
    });

    return () => {
      jumpSound.unload();
      clickSound.unload();
    };
  }, []);

  const playSFX = (name: string) => {
    const isMuted = localStorage.getItem('gameMuted') === 'true';
    if (sfx[name] && !isMuted) {
      sfx[name].play();
    }
  };

  return (
    <SoundContext.Provider value={{ playSFX }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};