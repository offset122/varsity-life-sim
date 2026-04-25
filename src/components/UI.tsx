import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  ShoppingBag, 
  Banana, 
  Users, 
  X, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Play, 
  FlaskConical,
  ArrowLeft,
  LayoutGrid,
  Package,
  Car,
  Palette
} from 'lucide-react';

// New specialized UI components
import CityBuilderUI from './CityBuilderUI';
import VehicleManagerUI from './VehicleManagerUI';
import InhabitantOverviewUI from './InhabitantUI';
import CharacterCustomizationUI from './CharacterUI';
import InventoryUI from './InventoryUI';
import ShopUI from './ShopUI';
import DrivingControls from './DrivingControls';

import { Vehicle, Inhabitant, InventoryItem } from '../types/game';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

interface UIProps {
  mode: 'menu' | 'hud' | 'lab';
  onStart?: () => void;
  onLab?: () => void;
  onExit?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  bananas: number;
  playersCount: number;

  // New props for systems
  activeUI: string;
  setActiveUI: (ui: any) => void;
  vehicles: Vehicle[];
  inhabitants: Inhabitant[];
  inventory: InventoryItem[];
  currentSkin: string;
  onSelectSkin: (skin: string) => void;
  onBuy: (item: any) => void;
  onSelectBuildingType: (type: string | null) => void;
  activeBuildingType: string | null;
  onDrive: (id: string) => void;
  isDriving: boolean;
}

const UI: React.FC<UIProps> = ({ 
  mode, 
  onStart, 
  onLab,
  onExit,
  isMuted, 
  onToggleMute, 
  messages, 
  onSendMessage,
  bananas,
  playersCount,
  activeUI,
  setActiveUI,
  vehicles,
  inhabitants,
  inventory,
  currentSkin,
  onSelectSkin,
  onBuy,
  onSelectBuildingType,
  activeBuildingType,
  onDrive,
  isDriving
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 md:p-10 font-sans z-50 overflow-hidden">
      
      {/* Sound & Meta Control */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 pointer-events-auto items-end">
        <button
          onClick={onToggleMute}
          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all shadow-xl text-white flex items-center gap-2 group"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap px-0 group-hover:px-2 font-bold uppercase text-xs">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {mode === 'hud' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-white font-bold shadow-xl">
            <Users size={18} className="text-blue-300" />
            <span>{playersCount} ACTIVE</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center flex-1 pointer-events-auto"
          >
            <div className="relative mb-8 text-center">
               <motion.h1 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[6rem] md:text-[10rem] font-black text-blue-700 select-none drop-shadow-[0_8px_0_rgba(255,255,255,1)] leading-[0.8]"
               >
                MINION
               </motion.h1>
               <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[4rem] md:text-[8rem] font-black text-yellow-400 select-none drop-shadow-[0_6px_0_rgba(29,78,216,1)] leading-none italic -rotate-2"
               >
                MAYHEM
               </motion.h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-12 py-6 rounded-[2.5rem] font-black text-4xl border-b-[10px] border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-2xl"
              >
                <Play fill="currentColor" size={40} />
                ENTER TOWN
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLab}
                className="group relative flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-[2rem] font-black text-xl border-b-[8px] border-blue-800 active:border-b-0 active:translate-y-1 transition-all shadow-2xl"
              >
                <FlaskConical size={28} />
                MINION LAB
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'lab' && (
          <motion.div
            key="lab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-start justify-between flex-1"
          >
            <button
              onClick={onExit}
              className="pointer-events-auto flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/30 transition-all border border-white/20"
            >
              <ArrowLeft size={24} /> EXIT LAB
            </button>
          </motion.div>
        )}

        {mode === 'hud' && !isDriving && (
          <>
            {/* Top Bar Stats */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full flex justify-between items-start pointer-events-none"
            >
              <div className="flex flex-wrap gap-4 pointer-events-auto max-w-[80%]">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-[2rem] border-4 border-white shadow-2xl text-white flex items-center gap-4">
                  <div className="bg-yellow-400 p-2 rounded-2xl shadow-inner">
                    <Banana size={32} className="text-blue-900" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-widest opacity-80 uppercase leading-none mb-1">Banana Bank</div>
                    <div className="text-3xl font-black">{bananas.toLocaleString()}</div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveUI('shop')}
                  className="bg-white p-4 rounded-3xl border-4 border-yellow-400 shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group pointer-events-auto"
                >
                  <ShoppingBag className="text-blue-900 group-hover:text-blue-700 transition-colors" size={28} />
                  <div className="text-blue-900 font-black text-xs uppercase">Shop</div>
                </button>

                <button 
                  onClick={() => setActiveUI('city')}
                  className="bg-blue-600 p-4 rounded-3xl border-4 border-white shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group pointer-events-auto text-white"
                >
                  <LayoutGrid className="group-hover:rotate-90 transition-transform" size={28} />
                  <div className="font-black text-xs uppercase">Build</div>
                </button>

                <button 
                  onClick={() => setActiveUI('vehicles')}
                  className="bg-yellow-400 p-4 rounded-3xl border-4 border-blue-600 shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group pointer-events-auto text-blue-900"
                >
                  <Car className="group-hover:translate-x-1 transition-transform" size={28} />
                  <div className="font-black text-xs uppercase">Garage</div>
                </button>

                <button 
                  onClick={() => setActiveUI('inventory')}
                  className="bg-slate-800 p-4 rounded-3xl border-4 border-slate-600 shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group pointer-events-auto text-white"
                >
                  <Package size={28} />
                  <div className="font-black text-xs uppercase">Items</div>
                </button>

                <button 
                  onClick={() => setActiveUI('character')}
                  className="bg-purple-600 p-4 rounded-3xl border-4 border-white shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group pointer-events-auto text-white"
                >
                  <Palette size={28} />
                  <div className="font-black text-xs uppercase">Skin</div>
                </button>
              </div>

              <button 
                onClick={() => setActiveUI('inhabitants')}
                className="bg-white p-3 rounded-2xl border-2 border-blue-600 shadow-xl flex items-center gap-3 pointer-events-auto hover:bg-slate-100 transition-colors"
              >
                 <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-black">
                    <Users size={20} />
                 </div>
                 <div className="text-blue-900 font-black text-[10px] uppercase leading-tight">
                    Inhabitants<br/><span className="text-blue-600">Overview</span>
                 </div>
              </button>
            </motion.div>

            {/* Bottom HUD: Chat & Controls */}
            <div className="w-full flex justify-between items-end pointer-events-none">
              
              {/* Chat Interface */}
              <div className="pointer-events-auto flex flex-col items-start gap-4 mb-4">
                <AnimatePresence>
                  {chatOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="w-80 h-96 bg-slate-900/80 backdrop-blur-2xl border-2 border-white/20 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl mb-2"
                    >
                      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center border-b border-white/10">
                        <span className="text-white font-black flex items-center gap-2">
                          <MessageSquare size={16} /> TOWN CHAT
                        </span>
                        <button onClick={() => setChatOpen(false)} className="text-white hover:text-blue-200">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.map((msg) => (
                          <div key={msg.id} className="flex flex-col">
                            <span className="text-yellow-400 text-[10px] font-black uppercase tracking-wider">{msg.user}</span>
                            <div className="bg-white/10 rounded-2xl px-4 py-2 text-white text-sm max-w-[90%] break-words">
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleSend} className="p-3 bg-white/5 flex gap-2">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-white/10 border-2 border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 transition-all text-sm"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-500 transition-colors">
                          <Send size={20} />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!chatOpen && (
                  <button
                    onClick={() => setChatOpen(true)}
                    className="relative bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 font-black"
                  >
                    <MessageSquare size={28} />
                    <span className="mr-2">CHAT</span>
                  </button>
                )}
              </div>

              <div className="pointer-events-auto bg-blue-900/40 backdrop-blur-md border border-white/10 p-4 rounded-3xl mb-4 flex items-center gap-4 text-white hover:bg-blue-900/60 transition-colors cursor-help group relative">
                 <Trophy className="text-yellow-400" />
                 <div className="text-xs">
                    <div className="opacity-60 font-bold uppercase tracking-tighter">Current Champ</div>
                    <div className="font-black text-yellow-400 uppercase">Gru's Favorite</div>
                 </div>
              </div>
            </div>
          </>
        )}

        {isDriving && (
           <DrivingControls 
              onExit={onExit!} 
              speed={vehicles.find(v => v.id === 'v1')?.speed || 0} 
           />
        )}
      </AnimatePresence>

      {/* Modals Overlay */}
      <AnimatePresence>
        {activeUI !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto"
          >
             {activeUI === 'shop' && <ShopUI onClose={() => setActiveUI('none')} bananas={bananas} onBuy={onBuy} />}
             {activeUI === 'city' && <CityBuilderUI onClose={() => setActiveUI('none')} onSelectBuilding={onSelectBuildingType} activeBuilding={activeBuildingType} />}
             {activeUI === 'vehicles' && <VehicleManagerUI vehicles={vehicles} onClose={() => setActiveUI('none')} onDrive={onDrive} />}
             {activeUI === 'inhabitants' && <InhabitantOverviewUI inhabitants={inhabitants} onClose={() => setActiveUI('none')} />}
             {activeUI === 'character' && <CharacterCustomizationUI onClose={() => setActiveUI('none')} currentSkin={currentSkin} onSelectSkin={onSelectSkin} />}
             {activeUI === 'inventory' && <InventoryUI items={inventory} onClose={() => setActiveUI('none')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UI;