import React, { useState } from 'react';
import { X, Banana, ShoppingBag, Car, Sword, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShopUIProps {
  onClose: () => void;
  bananas: number;
  onBuy: (item: any) => void;
}

const ShopUI: React.FC<ShopUIProps> = ({ onClose, bananas, onBuy }) => {
  const [tab, setTab] = useState<'vehicles' | 'weapons' | 'clothing'>('clothing');

  const shopItems = [
    // Clothing
    { id: 'c1', name: 'Red Overalls', price: 500, icon: '👕', type: 'clothing', color: 'bg-red-500' },
    { id: 'c2', name: 'Silver Goggles', price: 1200, icon: '🥽', type: 'clothing', color: 'bg-slate-400' },
    { id: 'c3', name: 'King Bob Crown', price: 5000, icon: '👑', type: 'clothing', color: 'bg-yellow-600' },
    { id: 'c4', name: 'Ninja Mask', price: 1500, icon: '🥷', type: 'clothing', color: 'bg-slate-900' },
    // Vehicles
    { id: 'v1', name: 'Gru Rocket', price: 15000, icon: '🚀', type: 'vehicle', color: 'bg-blue-600', speed: 120, acceleration: 90 },
    { id: 'v2', name: 'Minion Mobile', price: 8000, icon: '🏎️', type: 'vehicle', color: 'bg-yellow-400', speed: 80, acceleration: 60 },
    { id: 'v3', name: 'Banana Bike', price: 3000, icon: '🛵', type: 'vehicle', color: 'bg-green-400', speed: 50, acceleration: 40 },
    // Weapons
    { id: 'w1', name: 'Banana Launcher', price: 2500, icon: '🔫', type: 'weapon', color: 'bg-yellow-400' },
    { id: 'w2', name: 'Fart Gun', price: 3500, icon: '💨', type: 'weapon', color: 'bg-purple-400' },
    { id: 'w3', name: 'Freeze Ray', price: 6000, icon: '❄️', type: 'weapon', color: 'bg-blue-300' },
  ];

  const filteredItems = shopItems.filter(item => item.type === tab);

  return (
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      className="bg-white rounded-[3.5rem] w-full max-w-4xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-8 border-yellow-400 pointer-events-auto"
    >
      <div className="bg-blue-700 p-8 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-5xl font-black text-white italic -rotate-1 tracking-tighter">MINION MART</h3>
          <div className="flex items-center gap-2 mt-2">
            <Banana className="text-yellow-400 animate-bounce" size={20} />
            <p className="text-blue-200 font-black text-sm uppercase tracking-[0.2em]">{bananas.toLocaleString()} BANANAS AVAILABLE</p>
          </div>
        </div>
        <button onClick={onClose} className="relative z-10 bg-white/20 hover:bg-white/30 p-4 rounded-full text-white transition-colors">
          <X size={32} />
        </button>
        {/* Background Decorative Text */}
        <div className="absolute top-0 right-0 text-[10rem] font-black text-white/5 italic -rotate-12 select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
          SALE
        </div>
      </div>

      <div className="flex border-b-4 border-slate-100">
        {[
          { id: 'clothing', name: 'Apparel', icon: <Shirt size={18} /> },
          { id: 'vehicles', name: 'Vehicles', icon: <Car size={18} /> },
          { id: 'weapons', name: 'Gadgets', icon: <Sword size={18} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 py-6 flex items-center justify-center gap-3 font-black uppercase italic transition-all ${
              tab === t.id ? 'bg-yellow-400 text-blue-900 text-xl' : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>
      
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => bananas >= item.price && onBuy(item)}
            className={`group bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center border-4 transition-all cursor-pointer relative ${
              bananas >= item.price ? 'hover:border-blue-600 hover:bg-white hover:shadow-xl' : 'opacity-60 grayscale cursor-not-allowed border-transparent'
            }`}
          >
            <div className={`w-28 h-28 ${item.color} rounded-3xl flex items-center justify-center text-6xl shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
              {item.icon}
            </div>
            <div className="text-blue-900 font-black text-2xl mb-1 uppercase italic text-center leading-none">{item.name}</div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-lg mt-2">
              <Banana size={20} className="text-yellow-600" /> {item.price.toLocaleString()}
            </div>
            
            {tab === 'vehicles' && (
              <div className="mt-4 w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Speed</span>
                  <span className="text-blue-600">{item.speed}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{ width: `${(item.speed! / 150) * 100}%` }} />
                </div>
              </div>
            )}

            {bananas < item.price && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[2.5rem]">
                  <div className="bg-red-500 text-white px-4 py-1 rounded-full font-black text-xs -rotate-12 shadow-lg">
                    NEED MORE BANANAS
                  </div>
               </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-6 flex justify-center">
         <div className="text-white/40 font-bold text-[10px] uppercase tracking-[0.3em]">Authorized Minion Superstore &copy; Gru Enterprises</div>
      </div>
    </motion.div>
  );
};

export default ShopUI;