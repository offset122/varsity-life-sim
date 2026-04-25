import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Loader } from '@react-three/drei';
import Experience from './components/Experience';
import MinionShowcase from './components/MinionShowcase';
import UI from './components/UI';
import { SoundProvider } from './context/SoundContext';
import { Howl } from 'howler';
import { supabase } from './lib/supabase';
import { Building, Vehicle, Inhabitant, InventoryItem } from './types/game';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['KeyE'] },
];

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'lab'>('menu');
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('gameMuted');
    return saved === 'true';
  });

  // Gameplay States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bananas, setBananas] = useState(25000); 
  const [playersCount, setPlayersCount] = useState(1);
  const [userId] = useState(() => `Minion_${Math.floor(Math.random() * 9000) + 1000}`);
  const [currentSkin, setCurrentSkin] = useState('classic');
  
  // New Systems States
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', type: 'rocket', name: 'Gru Rocket', speed: 90, acceleration: 95, price: 15000, owned: true, color: 'bg-blue-600' },
    { id: 'v2', type: 'car', name: 'Minion Mobile', speed: 60, acceleration: 40, price: 8000, owned: false, color: 'bg-yellow-400' },
    { id: 'v3', type: 'bike', name: 'Banana Bike', speed: 40, acceleration: 60, price: 3000, owned: false, color: 'bg-green-400' },
  ]);
  const [inhabitants] = useState<Inhabitant[]>([
    { id: '1', name: 'Kevin', status: 'Working', activity: 'Testing Jellies' },
    { id: '2', name: 'Stuart', status: 'Resting', activity: 'Playing Ukulele' },
    { id: '3', name: 'Bob', status: 'Mischief', activity: 'Hiding Bananas' },
    { id: '4', name: 'Dave', status: 'Working', activity: 'Polishing Missiles' },
  ]);

  const [activeUI, setActiveUI] = useState<'none' | 'shop' | 'inventory' | 'city' | 'vehicles' | 'inhabitants' | 'character'>('none');
  const [activeBuildingType, setActiveBuildingType] = useState<string | null>(null);
  const [isDriving, setIsDriving] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  // Background Music
  useEffect(() => {
    const music = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-funny-and-playful-10.mp3'],
      loop: true,
      volume: 0.1,
      html5: true,
    });

    if (gameState !== 'menu' && !isMuted) {
      music.play();
    }

    return () => {
      music.stop();
      music.unload();
    };
  }, [gameState, isMuted]);

  // Real-time Chat
  useEffect(() => {
    if (gameState !== 'playing') return;

    const channel = supabase.channel('global-chat', {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on('broadcast', { event: 'chat' }, ({ payload }: { payload: ChatMessage }) => {
        setMessages(prev => [...prev.slice(-49), payload]);
      })
      .subscribe();

    const bananaInterval = setInterval(() => {
      setBananas(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(bananaInterval);
    };
  }, [gameState]);

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user: userId,
      text,
      timestamp: Date.now(),
    };

    supabase.channel('global-chat').send({
      type: 'broadcast',
      event: 'chat',
      payload: newMessage,
    });
  };

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    localStorage.setItem('gameMuted', String(newVal));
  };

  const handleBuy = (item: any) => {
    if (bananas >= item.price) {
      setBananas(prev => prev - item.price);
      if (item.type === 'vehicle') {
        setVehicles(prev => prev.map(v => v.id === item.id ? { ...v, owned: true } : v));
      } else {
        setInventory(prev => [...prev, { id: Math.random().toString(), name: item.name, type: item.type }]);
      }
    }
  };

  const handlePlaceBuilding = (pos: [number, number, number]) => {
    if (activeBuildingType) {
      const newBuilding: Building = {
        id: Math.random().toString(),
        type: activeBuildingType,
        position: pos,
        rotation: 0,
      };
      setBuildings(prev => [...prev, newBuilding]);
      setActiveBuildingType(null);
    }
  };

  const handleStartDriving = (id: string) => {
    const v = vehicles.find(v => v.id === id);
    if (v) {
      setCurrentVehicle(v);
      setIsDriving(true);
      setActiveUI('none');
    }
  };

  return (
    <div className="w-full h-screen bg-[#111827] overflow-hidden flex flex-col font-sans relative">
      
      {/* City Background Layer (CSS) - Kept for depth but darkened */}
      <div 
        id="city-background"
        className="fixed inset-0 pointer-events-none z-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale"
        style={{ display: 'block', visibility: 'visible' }}
      />

      <SoundProvider>
        <KeyboardControls map={keyboardMap}>
          <div className="relative flex-1 z-20">
            <Canvas 
              shadows
              dpr={[1, 1.5]}
              gl={{ 
                antialias: true,
                alpha: false, // Changed to false to prevent yellow background bleed
                stencil: false,
                depth: true
              }}
              camera={{ position: [0, 15, 30], fov: 45 }}
              onCreated={({ gl, scene }) => {
                gl.setClearColor('#111827');
              }}
            >
              <Suspense fallback={null}>
                {gameState === 'playing' ? (
                  <Experience 
                    buildings={buildings} 
                    onPlaceBuilding={handlePlaceBuilding}
                    activeBuildingType={activeBuildingType}
                    isDriving={isDriving}
                    currentVehicle={currentVehicle}
                    onExitVehicle={() => setIsDriving(false)}
                    currentSkin={currentSkin}
                  />
                ) : (
                  <MinionShowcase />
                )}
              </Suspense>
            </Canvas>
            
            <UI 
              mode={gameState === 'playing' ? 'hud' : gameState === 'lab' ? 'lab' : 'menu'}
              onStart={() => setGameState('playing')}
              onLab={() => setGameState('lab')}
              onExit={() => {
                  if (isDriving) setIsDriving(false);
                  else setGameState('menu');
              }}
              isMuted={isMuted} 
              onToggleMute={toggleMute} 
              messages={messages}
              onSendMessage={handleSendMessage}
              bananas={bananas}
              playersCount={playersCount}
              activeUI={activeUI}
              setActiveUI={setActiveUI}
              vehicles={vehicles}
              inhabitants={inhabitants}
              inventory={inventory}
              currentSkin={currentSkin}
              onSelectSkin={setCurrentSkin}
              onBuy={handleBuy}
              onSelectBuildingType={setActiveBuildingType}
              activeBuildingType={activeBuildingType}
              onDrive={handleStartDriving}
              isDriving={isDriving}
            />
          </div>
        </KeyboardControls>
      </SoundProvider>
      <Loader />
    </div>
  );
};

export default App;