import React from 'react';
import { Car, Zap, Shield, ChevronRight } from 'lucide-react';
import { Vehicle } from '../types/game';

interface VehicleManagerUIProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onDrive: (id: string) => void;
}

const VehicleManagerUI: React.FC<VehicleManagerUIProps> = ({ vehicles, onClose, onDrive }) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border-4 border-yellow-400 rounded-[3rem] p-8 w-full max-w-2xl pointer-events-auto max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-white italic flex items-center gap-3">
          <Car className="text-yellow-400" size={40} /> GARAGE
        </h2>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold bg-white/10 px-4 py-2 rounded-xl">CLOSE</button>
      </div>

      <div className="space-y-6">
        {vehicles.filter(v => v.owned).length === 0 ? (
           <div className="text-center py-12 bg-white/5 rounded-3xl border-2 border-dashed border-white/20">
              <p className="text-white font-bold opacity-50 uppercase tracking-widest">No vehicles owned yet</p>
              <p className="text-yellow-400 text-sm font-black mt-2">Visit the Minion Mart to buy your first ride!</p>
           </div>
        ) : (
          vehicles.filter(v => v.owned).map((v) => (
            <div key={v.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 transition-all">
              <div className={`w-24 h-24 ${v.color} rounded-2xl flex items-center justify-center text-5xl shadow-2xl`}>
                {v.type === 'rocket' ? '🚀' : v.type === 'car' ? '🏎️' : '🛵'}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black text-white uppercase italic">{v.name}</h3>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-yellow-400" />
                    <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: `${(v.speed / 150) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-blue-400" />
                    <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400" style={{ width: `${(v.acceleration / 100) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onDrive(v.id)}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3 rounded-2xl font-black text-lg flex items-center gap-2 group transition-all"
              >
                DRIVE <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VehicleManagerUI;