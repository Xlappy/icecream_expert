import React from 'react';
import { IceCream } from '../types';

interface IceCreamModalProps {
  iceCream: IceCream;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const getItemIcon = (type: string) => {
  switch (type) {
    case 'Classic': return '🍦';
    case 'Gelato': return '🍨';
    case 'Sorbet': return '🍧';
    case 'Soft Serve': return '🍦';
    case 'Vegan': return '🥥';
    case 'Frozen Yogurt': return '🥣';
    case 'Sherbet': return '🍹';
    case 'Mochi': return '🍡';
    default: return '🍦';
  }
};

const IceCreamModal: React.FC<IceCreamModalProps> = ({ iceCream, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-xl animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-3xl w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative animate-slideUp border border-white">
        <div className="p-12 pb-8">
          <div className="flex justify-between items-start mb-10">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-inner border border-indigo-100/50">
              {getItemIcon(iceCream.type)}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => onToggleFavorite(iceCream.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all hover:scale-110 active:scale-90 ${isFavorite ? 'bg-rose-50 text-rose-500' : 'bg-white text-indigo-100 hover:text-rose-500'}`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              <button onClick={onClose} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-indigo-950/20 hover:text-indigo-950 shadow-sm transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-5xl font-black text-indigo-950 tracking-tighter uppercase leading-[0.9]">{iceCream.name}</h2>
            <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">{iceCream.brand} • ПРЕМІУМ ЛІНІЙКА</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-1">Ціна за порцію</span>
              <span className="text-3xl font-black text-indigo-950 tracking-tighter">{iceCream.price} ₴</span>
            </div>
            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-1">Калорійність</span>
              <span className="text-3xl font-black text-indigo-950 tracking-tighter">{iceCream.calories} <small className="text-sm">ккал</small></span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[11px] font-black text-indigo-950 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-indigo-600"></span>
                СМАКОВИЙ ПРОФІЛЬ
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {[
                  { label: 'Жирність', value: iceCream.fatContent },
                  { label: 'Текстура', value: iceCream.texture },
                  { label: 'Солодкість', value: iceCream.sweetness },
                  { label: 'Кислотність', value: iceCream.acidity },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">{stat.label}</span>
                      <span className="text-[10px] font-black text-indigo-950">{stat.value}/5</span>
                    </div>
                    <div className="h-1.5 w-full bg-indigo-50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${stat.value * 20}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[11px] font-black text-indigo-950 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-indigo-600"></span>
                РЕКОМЕНДОВАНІ ТОПІНГИ
              </h3>
              <p className="text-sm font-medium text-indigo-900/70 leading-relaxed italic bg-neutral-50 p-6 rounded-[2rem] border border-indigo-50 shadow-inner">
                "{iceCream.toppingPairing}"
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-indigo-950 text-white flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Основний інгредієнт</span>
            <span className="text-sm font-black uppercase tracking-tight">{iceCream.baseIngredient}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Термін придатності</span>
            <span className="text-sm font-black uppercase tracking-tight">{iceCream.shelfLifeDays} дні</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IceCreamModal;
