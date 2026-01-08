import React from 'react';
import { IceCream } from '../types';

interface IceCreamTableProps {
  items: IceCream[];
  onUpdate: (updated: IceCream[]) => void;
  title: string;
}

const IceCreamTable: React.FC<IceCreamTableProps> = ({ items, onUpdate, title }) => {
  const handleEdit = (id: string, field: keyof IceCream, value: string | number) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей десерт?')) {
      onUpdate(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="bg-cream rounded-xl border-8 border-choco shadow-retro overflow-hidden relative">
      {/* Декоративна смужка зверху */}
      <div className="h-6 w-full bg-diner-blue border-b-8 border-choco pattern-stripes"></div>

      <div className="px-8 py-6 border-b-8 border-choco flex flex-col md:flex-row justify-between items-center gap-4 bg-cream">
        <h3 className="font-display text-4xl text-cherry-red transform -rotate-2 drop-shadow-sm">{title}</h3>
        <span className="font-display text-xl bg-diner-yellow px-6 py-2 rounded-full border-4 border-choco text-choco shadow-retro-sm">
          {items.length} СМАКІВ
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-diner-pink/30 border-b-8 border-choco">
            <tr>
              {['Назва', 'Стиль', 'Бренд', 'Ціна', 'Калорії', 'Жирність', 'Дії'].map(h => (
                <th key={h} className="px-6 py-4 font-body font-black text-choco uppercase tracking-widest text-sm">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-choco/10 font-body">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-diner-yellow/20 transition-colors group">
                <td className="px-6 py-5">
                  <input
                    className="bg-transparent font-body font-black text-lg text-choco border-none focus:ring-0 w-full"
                    value={item.name}
                    onChange={(e) => handleEdit(item.id, 'name', e.target.value)}
                  />
                </td>
                <td className="px-6 py-5">
                  <span className="bg-diner-blue/40 px-3 py-1 rounded-lg border-2 border-choco text-[10px] font-bold font-body uppercase inline-block whitespace-nowrap">{item.type}</span>
                </td>
                <td className="px-6 py-5">
                  <input
                    className="bg-transparent text-sm font-bold text-choco/60 uppercase border-none focus:ring-0 w-full"
                    value={item.brand}
                    onChange={(e) => handleEdit(item.id, 'brand', e.target.value)}
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 font-body font-black text-xl">
                    <input
                      type="number"
                      className="bg-transparent text-choco border-none focus:ring-0 w-20"
                      value={item.price}
                      onChange={(e) => handleEdit(item.id, 'price', parseInt(e.target.value))}
                    />
                    <span className="text-cherry-red font-display">₴</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="bg-transparent text-choco border-none focus:ring-0 w-16"
                      value={item.calories}
                      onChange={(e) => handleEdit(item.id, 'calories', parseInt(e.target.value))}
                    />
                    <span className="text-xs text-choco/40 uppercase">kcal</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div
                        key={v}
                        onClick={() => handleEdit(item.id, 'fatContent', v)}
                        className={`w-4 h-4 rounded-full cursor-pointer border-2 border-choco transition-all ${item.fatContent >= v ? 'bg-cherry-red scale-110 shadow-sm' : 'bg-cream'}`}
                      ></div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-10 h-10 bg-cream border-2 border-choco rounded-full flex items-center justify-center hover:bg-cherry-red hover:text-white transition-all shadow-retro-sm active:shadow-none active:translate-y-1"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-24 text-center bg-cream/50">
            <p className="font-display text-3xl text-choco/20 uppercase tracking-widest italic">Нічого не знайдено...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IceCreamTable;
