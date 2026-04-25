import React from 'react';
import { Users, Activity, Heart } from 'lucide-react';
import { Inhabitant } from '../types/game';

interface InhabitantOverviewUIProps {
  onClose: () => void;
  inhabitants: Inhabitant[];
}

const InhabitantOverviewUI: React.FC<InhabitantOverviewUIProps> = ({ onClose, inhabitants }) => {
  return (
    <div className="bg-blue-900/90 backdrop-blur-2xl border-4 border-blue-400 rounded-[3rem] p-8 w-full max-w-xl pointer-events-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white italic flex items-center gap-3">
          <Users className="text-blue-300" /> INHABITANTS
        </h2>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold bg-white/10 px-4 py-2 rounded-xl">CLOSE</button>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        {inhabitants.map((inhabitant) => (
          <div key={inhabitant.id} className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl border-2 border-white/20">
              {Math.random() > 0.5 ? '👁️' : '👁️‍🗨️'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-white font-black uppercase text-sm tracking-widest">{inhabitant.name}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  inhabitant.status === 'Working' ? 'bg-green-500 text-white' : 
                  inhabitant.status === 'Mischief' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {inhabitant.status}
                </span>
              </div>
              <div className="text-blue-200 text-xs mt-1 flex items-center gap-2">
                <Activity size={12} /> {inhabitant.activity}
              </div>
            </div>
            <div className="flex items-center gap-1 text-pink-400">
              <Heart size={14} fill="currentColor" />
              <span className="font-bold text-xs">{Math.floor(Math.random() * 20 + 80)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InhabitantOverviewUI;