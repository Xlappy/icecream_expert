
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
    <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-blue-50 flex justify-between items-center bg-blue-50/10">
        <h3 className="font-black text-blue-900 uppercase tracking-tight text-sm">{title}</h3>
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{items.length} одиниць</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50/30">
              {['Назва', 'Стиль', 'Бренд', 'Ціна', 'Калорії', 'Жирність', 'Дії'].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-black text-blue-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-6 py-5">
                  <input
                    className="bg-transparent font-black text-blue-900 border-none focus:ring-0 w-full text-sm"
                    value={item.name}
                    onChange={(e) => handleEdit(item.id, 'name', e.target.value)}
                  />
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full uppercase">{item.type}</span>
                </td>
                <td className="px-6 py-5">
                  <input
                    className="bg-transparent text-[11px] font-bold text-blue-500 uppercase border-none focus:ring-0 w-full"
                    value={item.brand}
                    onChange={(e) => handleEdit(item.id, 'brand', e.target.value)}
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="bg-transparent font-black text-blue-900 border-none focus:ring-0 w-16 text-sm"
                      value={item.price}
                      onChange={(e) => handleEdit(item.id, 'price', parseInt(e.target.value))}
                    />
                    <span className="text-[10px] font-bold text-blue-300">₴</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="bg-transparent font-black text-blue-900 border-none focus:ring-0 w-16 text-sm"
                      value={item.calories}
                      onChange={(e) => handleEdit(item.id, 'calories', parseInt(e.target.value))}
                    />
                    <span className="text-[10px] font-bold text-blue-300">kcal</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div
                        key={v}
                        onClick={() => handleEdit(item.id, 'fatContent', v)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${item.fatContent >= v ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-200'}`}
                      ></div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-blue-200 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-blue-300 font-bold uppercase tracking-widest text-[10px]">Записи відсутні</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IceCreamTable;
