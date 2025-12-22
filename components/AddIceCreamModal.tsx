
import React, { useState } from 'react';
import { IceCream } from '../types';
import { ICE_CREAM_TYPES, ORIGIN_TYPES } from '../constants';

interface AddIceCreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: IceCream) => void;
}

const AddIceCreamModal: React.FC<AddIceCreamModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<IceCream>>({
    type: 'Classic',
    origin: 'Local',
    fatContent: 3,
    texture: 3,
    acidity: 1,
    sweetness: 3,
    shelfLifeDays: 90
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: IceCream = {
      ...formData as IceCream,
      id: `custom-${Date.now()}`,
    };
    onAdd(newItem);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['calories', 'fatContent', 'texture', 'acidity', 'sweetness', 'price', 'shelfLifeDays'].includes(name)
        ? Number(value)
        : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-slideUp flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-blue-50 flex justify-between items-center bg-blue-50/20">
          <div>
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Новий Десерт</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Додавання до глобального реєстру</p>
          </div>
          <button onClick={onClose} className="text-blue-900/20 hover:text-blue-900 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Основна інформація</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Назва продукту</label>
                <input required name="name" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" placeholder="Напр. Mango Fantasy" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Тип</label>
                  <select name="type" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all appearance-none uppercase">
                    {ICE_CREAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Походження</label>
                  <select name="origin" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all appearance-none uppercase">
                    {ORIGIN_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Бренд</label>
                  <input required name="brand" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Основа</label>
                  <input required name="baseIngredient" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Характеристики та Ціна</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Ціна (₴)</label>
                  <input required type="number" name="price" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Ккал</label>
                  <input required type="number" name="calories" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Термін (днів)</label>
                  <input required type="number" name="shelfLifeDays" onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all" defaultValue={90} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {['fatContent', 'texture', 'acidity', 'sweetness'].map(field => (
                  <div key={field}>
                    <label className="block text-[9px] font-black text-blue-400 uppercase mb-3 tracking-widest">{field === 'fatContent' ? 'Жирність' : field === 'texture' ? 'Текстура' : field === 'acidity' ? 'Кислотність' : 'Солодкість'}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} type="button" onClick={() => setFormData(prev => ({ ...prev, [field]: v }))} className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all ${formData[field as keyof IceCream] === v ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-blue-50 text-blue-300'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 tracking-widest">Поєднання (Топінги)</label>
                <textarea name="toppingPairing" onChange={handleChange} rows={2} className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 text-sm font-bold text-blue-900 outline-none transition-all resize-none" placeholder="Напр. Свіжа м'ята, шоколадний соус, горіхи кеш'ю..." />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6 border-t border-blue-50 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-900 transition-all">Скасувати</button>
            <button type="submit" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all">Зберегти в реєстр</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIceCreamModal;
