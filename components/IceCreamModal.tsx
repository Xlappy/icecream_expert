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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-choco/60 animate-fadeIn">
      <div className="retro-card w-full max-w-2xl bg-cream relative animate-slideUp p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Strip */}
        <div className="h-4 w-full bg-cherry-red border-b-4 border-choco pattern-stripes"></div>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-10">
            <div className="w-32 h-32 bg-white rounded-3xl border-8 border-choco flex items-center justify-center text-8xl shadow-retro rotate-[-3deg]">
              {getItemIcon(iceCream.type)}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => onToggleFavorite(iceCream.id)}
                className={`retro-btn w-16 h-16 rounded-full p-0 flex items-center justify-center text-3xl ${isFavorite ? 'bg-cream' : 'bg-white'}`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              <button onClick={onClose} className="retro-btn w-16 h-16 rounded-full p-0 flex items-center justify-center text-3xl bg-diner-blue">
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h2 className="text-6xl text-choco uppercase leading-none drop-shadow-sm">{iceCream.name}</h2>
            <div className="flex justify-center gap-4">
              <span className="font-display text-diner-blue text-lg uppercase tracking-widest">{iceCream.brand}</span>
              <span className="text-choco/30">|</span>
              <span className="font-display text-cherry-red text-lg uppercase tracking-widest">ПРЕМІУМ-ВИНІЛ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-diner-yellow p-6 border-4 border-choco shadow-retro-sm transform rotate-[-1deg]">
              <span className="font-body font-black text-choco/60 uppercase tracking-widest block mb-2 text-xs">Ціна за порцію</span>
              <span className="font-display text-4xl text-choco">{iceCream.price} ₴</span>
            </div>
            <div className="bg-diner-pink p-6 border-4 border-choco shadow-retro-sm transform rotate-[1deg]">
              <span className="font-body font-black text-choco/60 uppercase tracking-widest block mb-2 text-xs">Калорійність</span>
              <span className="font-display text-4xl text-choco">{iceCream.calories} <small className="text-xl">KCAL</small></span>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="font-display text-2xl text-choco mb-6 flex items-center gap-4">
                <span className="h-2 flex-grow bg-choco/20 rounded-full"></span>
                ПРОФІЛЬ СМАКУ
                <span className="h-2 flex-grow bg-choco/20 rounded-full"></span>
              </h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 p-6 bg-white border-4 border-choco border-dashed rounded-2xl">
                {[
                  { label: 'Жирність', value: iceCream.fatContent },
                  { label: 'Текстура', value: iceCream.texture },
                  { label: 'Солодкість', value: iceCream.sweetness },
                  { label: 'Кислотність', value: iceCream.acidity },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-body font-black text-choco/60 uppercase text-xs tracking-widest">{stat.label}</span>
                      <span className="font-display text-choco">{stat.value}/5</span>
                    </div>
                    <div className="h-6 w-full bg-cream border-4 border-choco overflow-hidden rounded-full">
                      <div className="h-full bg-diner-blue transition-all duration-1000 border-r-4 border-choco shadow-inner" style={{ width: `${stat.value * 20}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl text-cherry-red mb-4">НАША РЕКОМЕНДАЦІЯ:</h3>
              <p className="font-body font-bold text-xl text-choco leading-relaxed bg-diner-yellow/20 p-8 rounded-2xl border-4 border-choco border-dotted shadow-inner italic">
                "Ми впевнені, що найкраще цей смак розкриється у поєднанні з {iceCream.toppingPairing.toLowerCase()}. Смачного!"
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-choco text-cream flex justify-between items-center border-t-8 border-diner-blue">
          <div className="flex flex-col">
            <span className="font-body font-black text-diner-blue uppercase tracking-widest text-[10px]">ОСНОВНИЙ ІНГРЕДІЄНТ</span>
            <span className="font-display text-xl uppercase">{iceCream.baseIngredient}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="font-body font-black text-diner-blue uppercase tracking-widest text-[10px]">ТЕРМІН ПРИДАТНОСТІ</span>
            <span className="font-display text-xl uppercase">{iceCream.shelfLifeDays} ДНІВ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IceCreamModal;
