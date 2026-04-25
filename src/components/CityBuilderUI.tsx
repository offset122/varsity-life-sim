import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Plus, Trash2, RotateCw } from 'lucide-react';

interface CityBuilderUIProps {
  onClose: () => void;
  onSelectBuilding: (type: string) => void;
  activeBuilding: string | null;
}

const CityBuilderUI: React.FC<CityBuilderUIProps> = ({ onClose, onSelectBuilding, activeBuilding }) => {
  const buildingTypes = [
    { id: 'house', name: 'Suburban House', icon: '🏠' },
    { id: 'lab', name: 'Mini Lab', icon: '🧪' },
    { id: 'factory', name: 'Cookie Factory', icon: '🍪' },
    { id: 'tower', name: 'Gru Tower', icon: '🏢' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border-4 border-blue-500 rounded-[3rem] p-8 w-full max-w-lg pointer-events-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-white italic flex items-center gap-3">
          <LayoutGrid className="text-blue-400" /> CITY BUILDER
        </h2>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold">CLOSE</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {buildingTypes.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectBuilding(b.id)}
            className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${
              activeBuilding === b.id 
              ? 'border-yellow-400 bg-yellow-400/20' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-4xl">{b.icon}</span>
            <span className="text-white font-black text-sm uppercase">{b.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/50 text-blue-200 text-sm font-bold flex items-center gap-3">
        <Plus size={20} className="text-blue-400" />
        SELECT A STRUCTURE TO PLACE IT IN THE TOWN
      </div>
      
      {activeBuilding && (
        <div className="mt-4 flex gap-4">
           <div className="flex-1 bg-yellow-400 p-4 rounded-xl text-blue-900 font-black text-center text-xs uppercase animate-pulse">
              Click on the ground to place
           </div>
        </div>
      )}
    </div>
  );
};

export default CityBuilderUI;