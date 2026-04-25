import React from 'react';
import { Package, Trash2, Info } from 'lucide-react';
import { InventoryItem } from '../types/game';

interface InventoryUIProps {
  onClose: () => void;
  items: InventoryItem[];
  onUse?: (id: string) => void;
  onDiscard?: (id: string) => void;
}

const InventoryUI: React.FC<InventoryUIProps> = ({ onClose, items, onUse, onDiscard }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border-4 border-blue-600 rounded-[3rem] p-8 w-full max-w-2xl pointer-events-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white italic flex items-center gap-3">
          <Package className="text-blue-400" /> INVENTORY
        </h2>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold bg-white/10 px-4 py-2 rounded-xl">CLOSE</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-white/40 font-black uppercase tracking-widest">Bag is empty</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center group relative overflow-hidden">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
            <div className="text-white font-black text-[10px] uppercase text-center mb-4">{item.name}</div>
            
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => onUse?.(item.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg font-black text-[10px] uppercase"
              >
                USE
              </button>
              <button 
                onClick={() => onDiscard?.(item.id)}
                className="bg-red-500/20 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-900/40 p-4 rounded-2xl flex items-center gap-3">
         <div className="bg-blue-500/20 p-2 rounded-xl">
            <Info className="text-blue-400" size={20} />
         </div>
         <p className="text-blue-200 text-xs font-bold leading-relaxed">
            Items found in the town or bought from the Minion Mart will appear here. Weapons can be equipped for chaotic fun!
         </p>
      </div>
    </div>
  );
};

export default InventoryUI;