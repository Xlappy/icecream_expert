import React from 'react';
import { IceCream, Recommendation } from '../types';

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalItem: IceCream;
  alternatives: Recommendation[];
  allItems: IceCream[];
  onSelect: (iceCreamId: string) => void;
  onAutoSelect: () => void;
}

const ReplacementModal: React.FC<ReplacementModalProps> = ({
  isOpen, onClose, originalItem, alternatives, allItems, onSelect, onAutoSelect
}) => {
  if (!isOpen) return null;

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
      default: return '🍨';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-choco/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="retro-card w-full max-w-4xl bg-cream relative animate-slideUp p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 bg-choco text-cream border-b-8 border-diner-blue flex justify-between items-center pattern-stripes">
          <div>
            <h2 className="text-4xl font-display text-white drop-shadow-md">ПІДБІР АЛЬТЕРНАТИВИ</h2>
            <p className="font-body font-bold text-diner-blue text-xs uppercase tracking-widest mt-1">ЗАМІНА ДЛЯ: {originalItem.name}</p>
          </div>
          <button onClick={onClose} className="retro-btn w-12 h-12 p-0 flex items-center justify-center bg-white text-choco text-2xl">✕</button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar flex-grow space-y-12">
          <button
            onClick={onAutoSelect}
            className="w-full bg-cherry-red text-white p-8 border-8 border-choco shadow-retro flex items-center justify-between group hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="text-left">
              <span className="block font-body font-black uppercase tracking-widest text-xs opacity-80 mb-2">АВТОМАТИЧНИЙ ПІДБІР</span>
              <span className="text-3xl font-display uppercase tracking-tight">РОЗУМНА ОПТИМІЗАЦІЯ</span>
            </div>
            <div className="text-6xl group-hover:rotate-180 transition-transform duration-[1s]">🔄</div>
          </button>

          <div className="space-y-6">
            <h3 className="font-display text-2xl text-choco border-b-4 border-choco/10 pb-2">ДОСТУПНІ ВАРІАНТИ</h3>
            {alternatives.map((rec) => {
              const item = allItems.find(i => i.id === rec.iceCreamId);
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="w-full bg-white border-4 border-choco p-8 flex items-center justify-between text-left hover:bg-diner-yellow/10 transition-all group shadow-retro-sm active:shadow-none active:translate-y-1"
                >
                  <div className="flex items-center gap-8">
                    <div className="text-6xl drop-shadow-sm filter grayscale group-hover:grayscale-0 transition-all">{getItemIcon(item.type)}</div>
                    <div>
                      <h4 className="font-display text-2xl text-choco uppercase leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-body font-black text-diner-blue uppercase tracking-widest text-xs">{item.brand}</span>
                        <span className="font-display text-cherry-red text-xl">{item.price} ₴</span>
                      </div>
                      <p className="font-body font-bold text-sm text-choco/40 mt-4 italic line-clamp-2 max-w-lg">"{rec.explanation}"</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="bg-diner-blue px-3 py-1 border-2 border-choco font-display text-sm mb-4">MATCH: {rec.score}%</div>
                    <span className="font-display text-choco hover:text-cherry-red transition-colors">ВИБРАТИ →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-choco text-cream text-center font-body font-black text-[10px] tracking-[0.3em] uppercase">
          JUKEBOX ANALYTICS v5.0.0 • READY TO SERVE
        </div>
      </div>
    </div>
  );
};

export default ReplacementModal;
