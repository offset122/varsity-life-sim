import React from 'react';
import { motion } from 'framer-motion';
import { Car, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface DrivingControlsProps {
  onExit: () => void;
  speed: number;
}

const DrivingControls: React.FC<DrivingControlsProps> = ({ onExit, speed }) => {
  return (
    <div className="absolute inset-x-0 bottom-10 flex flex-col items-center pointer-events-none px-6">
      <div className="bg-black/60 backdrop-blur-2xl border-4 border-yellow-400 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-8">
           <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1">Speedometer</div>
              <div className="text-5xl font-black text-white italic">
                {Math.floor(speed)} <span className="text-xl text-white/50">km/h</span>
              </div>
           </div>
           
           <div className="h-16 w-[2px] bg-white/20" />

           <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white"><ArrowUp size={24} /></div>
                 <div className="text-[8px] font-black text-center text-white/40">GAS</div>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white"><ArrowDown size={24} /></div>
                 <div className="text-[8px] font-black text-center text-white/40">BRAKE</div>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white flex-row"><ArrowLeft size={16} /><ArrowRight size={16} /></div>
                 <div className="text-[8px] font-black text-center text-white/40">STEER</div>
              </div>
           </div>

           <button 
              onClick={onExit}
              className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-3xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-black"
           >
              <X size={24} /> EXIT VEHICLE
           </button>
        </div>
      </div>
      
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-6 bg-yellow-400 px-6 py-2 rounded-full text-blue-900 font-black text-xs uppercase tracking-widest shadow-xl border-2 border-white"
      >
        Pedal to the metal!
      </motion.div>
    </div>
  );
};

export default DrivingControls;