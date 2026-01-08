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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-choco/60 backdrop-blur-sm animate-fadeIn">
      <div className="retro-card w-full max-w-4xl bg-cream relative animate-slideUp p-0 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-8 bg-choco text-cream border-b-8 border-cherry-red flex justify-between items-center pattern-stripes">
          <h2 className="text-5xl font-display text-white drop-shadow-md">НОВИЙ РЕЦЕПТ</h2>
          <button onClick={onClose} className="retro-btn w-12 h-12 p-0 flex items-center justify-center bg-white text-choco text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <h3 className="font-display text-2xl text-choco border-b-4 border-choco/10 pb-2">ІНФОРМАЦІЯ</h3>
            <div className="space-y-6">
              <div>
                <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Назва десерту</label>
                <input required name="name" onChange={handleChange} className="retro-input w-full text-xl font-display" placeholder="НАПР. BLUEBERRY HILL" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Категорія</label>
                  <select name="type" onChange={handleChange} className="retro-input w-full font-bold uppercase text-sm">
                    {ICE_CREAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Походження</label>
                  <select name="origin" onChange={handleChange} className="retro-input w-full font-bold uppercase text-sm">
                    {ORIGIN_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Виробник (Бренд)</label>
                  <input required name="brand" onChange={handleChange} className="retro-input w-full font-bold" />
                </div>
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Основний інгредієнт</label>
                  <input required name="baseIngredient" onChange={handleChange} className="retro-input w-full font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-display text-2xl text-cherry-red border-b-4 border-cherry-red/10 pb-2">ПАРАМЕТРИ</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Ціна (₴)</label>
                  <input required type="number" name="price" onChange={handleChange} className="retro-input w-full font-display text-xl" />
                </div>
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Ккал</label>
                  <input required type="number" name="calories" onChange={handleChange} className="retro-input w-full font-display text-xl" />
                </div>
                <div>
                  <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Термін (дні)</label>
                  <input required type="number" name="shelfLifeDays" onChange={handleChange} className="retro-input w-full font-display text-xl" defaultValue={90} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {['fatContent', 'texture', 'acidity', 'sweetness'].map(field => (
                  <div key={field}>
                    <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-3">
                      {field === 'fatContent' ? 'ЖИРНІСТЬ' : field === 'texture' ? 'ТЕКСТУРА' : field === 'acidity' ? 'КИСЛОТНІСТЬ' : 'СОЛОДКІСТЬ'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [field]: v }))}
                          className={`w-10 h-10 border-4 border-choco font-display text-lg transition-all rounded-full flex items-center justify-center ${formData[field as keyof IceCream] === v
                              ? 'bg-cherry-red text-white shadow-retro-sm scale-110'
                              : 'bg-white text-choco/20 hover:text-choco/40'
                            }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <label className="block font-body font-black text-choco/40 uppercase tracking-widest text-xs mb-2">Топінги (через кому)</label>
                <textarea name="toppingPairing" onChange={handleChange} rows={2} className="retro-input w-full font-bold resize-none" placeholder="СВІЖА М'ЯТА, ШОКОЛАДНИЙ СОУС..." />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-10 border-t-8 border-choco/10 flex justify-end gap-6">
            <button type="button" onClick={onClose} className="font-display text-choco hover:text-cherry-red transition-colors text-xl">СКАСУВАТИ</button>
            <button type="submit" className="retro-btn text-2xl px-12 py-4 bg-cherry-red">ЗБЕРЕГТИ В МЕНЮ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIceCreamModal;
