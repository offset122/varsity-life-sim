import React from 'react';
import { User, Palette, Check } from 'lucide-react';

interface CharacterCustomizationUIProps {
  onClose: () => void;
  currentSkin: string;
  onSelectSkin: (skin: string) => void;
}

const CharacterCustomizationUI: React.FC<CharacterCustomizationUIProps> = ({ onClose, currentSkin, onSelectSkin }) => {
  const skins = [
    { id: 'classic', name: 'Classic Yellow', color: 'bg-yellow-400', preview: '🍌' },
    { id: 'purple', name: 'Evil Purple', color: 'bg-purple-600', preview: '😈' },
    { id: 'fireman', name: 'Fireman', color: 'bg-red-500', preview: '👨‍🚒' },
    { id: 'maid', name: 'Phil Maid', color: 'bg-slate-200', preview: '🧹' },
    { id: 'king', name: 'King Bob', color: 'bg-yellow-600', preview: '👑' },
    { id: 'ninja', name: 'Stealth Ninja', color: 'bg-slate-900', preview: '🥷' },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border-4 border-white/20 rounded-[3rem] p-8 w-full max-w-2xl pointer-events-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white italic flex items-center gap-3">
          <Palette className="text-blue-400" /> CHARACTER CUSTOMIZER
        </h2>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold bg-white/10 px-4 py-2 rounded-xl">CLOSE</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {skins.map((skin) => (
          <button
            key={skin.id}
            onClick={() => onSelectSkin(skin.id)}
            className={`relative p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 group ${
              currentSkin === skin.id 
              ? 'border-yellow-400 bg-yellow-400/10 scale-105' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {currentSkin === skin.id && (
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 p-1.5 rounded-full shadow-lg">
                <Check size={16} strokeWidth={4} />
              </div>
            )}
            <div className={`w-20 h-20 ${skin.color} rounded-[2rem] flex items-center justify-center text-4xl shadow-xl group-hover:rotate-12 transition-transform`}>
              {skin.preview}
            </div>
            <span className="text-white font-black text-sm uppercase tracking-tight">{skin.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
        <button 
          onClick={onClose}
          className="bg-white text-blue-900 px-12 py-4 rounded-2xl font-black text-xl hover:bg-yellow-400 transition-colors shadow-2xl"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};

export default CharacterCustomizationUI;