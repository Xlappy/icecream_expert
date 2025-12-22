
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10 animate-fadeIn bg-indigo-950/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-neutral-50 w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideIn max-h-[90vh] flex flex-col border border-white">
        <div className="p-12 border-b border-indigo-100 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-4xl font-black text-indigo-950 uppercase tracking-tighter">ПІДБІР АЛЬТЕРНАТИВИ</h2>
            <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2">ЗАМІНА ДЛЯ: <span className="text-indigo-900 border-b-2 border-indigo-100">{originalItem.name}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-950/20 hover:text-indigo-950 shadow-sm transition-all active:scale-90"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>

        <div className="p-12 overflow-y-auto custom-scrollbar space-y-12 flex-grow">
          <button
            onClick={onAutoSelect}
            className="w-full bg-indigo-600 text-white p-10 rounded-[3.5rem] flex items-center justify-between group hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98]"
          >
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-3">АНАЛІТИЧНИЙ РЕЖИМ</span>
              <span className="text-2xl font-black tracking-tight uppercase leading-none">АВТОМАТИЧНА ОПТИМІЗАЦІЯ СИСТЕМИ</span>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-4xl group-hover:rotate-180 transition-transform duration-[1.5s]">🔄</div>
          </button>

          <div className="grid grid-cols-1 gap-6">
            <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] ps-5">ДОСТУПНІ ВАРІАНТИ</h3>
            {alternatives.map((rec) => {
              const item = allItems.find(i => i.id === rec.iceCreamId);
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="w-full bg-white border border-indigo-50 p-10 rounded-[3.5rem] flex items-center justify-between text-left hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all group active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-10">
                    <div className="w-20 h-20 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-700 shadow-inner">{getItemIcon(item.type)}</div>
                    <div>
                      <h4 className="font-black text-2xl text-indigo-950 tracking-tighter leading-tight uppercase">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{item.brand}</span>
                        <span className="w-1.5 h-1.5 bg-indigo-100 rounded-full"></span>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{item.price} ₴</span>
                      </div>
                      <p className="text-[14px] text-indigo-900/60 mt-5 line-clamp-2 italic font-medium leading-relaxed max-w-lg">"{rec.explanation}"</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-black text-indigo-950 bg-indigo-50 px-4 py-2 rounded-xl mb-6 tracking-widest border border-indigo-100 uppercase">MATCH: {rec.score}%</div>
                    <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white px-5 py-2.5 rounded-xl transition-all">ВИБРАТИ →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8 bg-indigo-50/30 border-t border-indigo-100 text-center shrink-0">
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">GOURMET-ENGINE ANALYTICS v2.4.1</p>
        </div>
      </div>
    </div>
  );
};

export default ReplacementModal;
