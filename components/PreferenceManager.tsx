
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { ICE_CREAM_TYPES, POPULAR_FLAVORS } from '../constants';

interface PreferenceManagerProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  compact?: boolean;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, onChange, compact = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleStyle = (style: string) => {
    const newStyles = preferences.likedStyles.includes(style)
      ? preferences.likedStyles.filter(s => s !== style)
      : [...preferences.likedStyles, style];
    onChange({ ...preferences, likedStyles: newStyles });
  };

  const toggleFlavor = (flavor: string, type: 'like' | 'dislike') => {
    if (type === 'like') {
      const newFlavors = preferences.favoriteFlavors.includes(flavor)
        ? preferences.favoriteFlavors.filter(f => f !== flavor)
        : [...preferences.favoriteFlavors, flavor];
      const newDisliked = (preferences.dislikedFlavors || []).filter(f => f !== flavor);
      onChange({ ...preferences, favoriteFlavors: newFlavors, dislikedFlavors: newDisliked });
    } else {
      const newDisliked = (preferences.dislikedFlavors || []).includes(flavor)
        ? preferences.dislikedFlavors.filter(f => f !== flavor)
        : [...(preferences.dislikedFlavors || []), flavor];
      const newLiked = preferences.favoriteFlavors.filter(f => f !== flavor);
      onChange({ ...preferences, favoriteFlavors: newLiked, dislikedFlavors: newDisliked });
    }
  };

  const translateType = (type: string) => {
    const map: Record<string, string> = {
      'Classic': 'Класичне', 'Gelato': 'Джелато', 'Sorbet': 'Сорбет', 'Soft Serve': 'М`яке', 'Vegan': 'Веган'
    };
    return map[type] || type;
  };

  return (
    <div className={`bg-white transition-all duration-700 ${compact
      ? 'p-8 rounded-[3rem] shadow-2xl border border-indigo-100'
      : 'p-6 rounded-3xl shadow-sm border border-indigo-100'
      } space-y-8`}>

      {/* Стилі */}
      <div>
        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 block">КЛАСИФІКАЦІЯ</label>
        <div className={`flex flex-wrap gap-2 ${compact ? 'justify-center' : ''}`}>
          {ICE_CREAM_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleStyle(type)}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border tracking-tight ${preferences.likedStyles.includes(type)
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/10'
                : 'bg-indigo-50 text-indigo-500 border-indigo-100 hover:border-indigo-200'
                }`}
            >
              {translateType(type)}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${compact && !showAdvanced ? 'hidden' : ''}`}>
        {/* Ціна */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">МАКСИМАЛЬНА ЦІНА (₴)</label>
            <span className="text-indigo-900 font-black text-sm">{preferences.priceRange[1]}</span>
          </div>
          <input
            type="range" min="30" max="500" step="5"
            value={preferences.priceRange[1]}
            onChange={(e) => onChange({ ...preferences, priceRange: [preferences.priceRange[0], Number(e.target.value)] })}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Калорії */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">КАЛОРІЙНІСТЬ (ДО)</label>
            <span className="text-indigo-900 font-black text-sm">{preferences.calorieRange[1]} ккал</span>
          </div>
          <input
            type="range" min="50" max="1000" step="10"
            value={preferences.calorieRange[1]}
            onChange={(e) => onChange({ ...preferences, calorieRange: [preferences.calorieRange[0], Number(e.target.value)] })}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Технічні параметри */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 block text-center">ТЕРМІН ПРИДАТНОСТІ</label>
            <select
              value={preferences.minShelfLife || 0}
              onChange={(e) => onChange({ ...preferences, minShelfLife: Number(e.target.value) })}
              className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-[10px] font-black text-indigo-900 focus:ring-1 focus:ring-indigo-600 outline-none uppercase"
            >
              <option value="0">БЕЗ ВИМОГ</option>
              <option value="30">30+ ДНІВ</option>
              <option value="90">90+ ДНІВ</option>
              <option value="180">180+ ДНІВ</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 block text-center">ЖИРНІСТЬ</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(b => (
                <button
                  key={b}
                  onClick={() => onChange({ ...preferences, preferredFatContent: b })}
                  className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${preferences.preferredFatContent === b
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-indigo-50 text-indigo-400 border-indigo-100'
                    }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {compact && (
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-indigo-400 hover:text-indigo-900 font-bold text-[9px] uppercase tracking-widest py-3 border-t border-indigo-50 transition-all"
        >
          {showAdvanced ? 'ПРИХОВАТИ ФІЛЬТРИ ↑' : 'РОЗШИРЕНІ ПАРАМЕТРИ ↓'}
        </button>
      )}

      <div className={`space-y-8 transition-all duration-700 overflow-hidden ${(compact && !showAdvanced) ? 'max-h-0 opacity-0 invisible' : 'max-h-[1000px] opacity-100 visible'
        }`}>
        <div>
          <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 block">УЛУБЛЕНІ СМАКИ</label>
          <div className={`flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1 ${compact ? 'justify-center' : ''}`}>
            {POPULAR_FLAVORS.map(flavor => (
              <button
                key={flavor}
                onClick={() => toggleFlavor(flavor, 'like')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-tight transition-all ${preferences.favoriteFlavors.includes(flavor)
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  : 'bg-white text-indigo-400 border-indigo-100'
                  }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-indigo-100">
          <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-4 block flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse shadow-sm"></span>
            ІГНОРУВАТИ СМАКИ
          </label>
          <div className={`flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1 ${compact ? 'justify-center' : ''}`}>
            {POPULAR_FLAVORS.map(flavor => (
              <button
                key={flavor}
                onClick={() => toggleFlavor(flavor, 'dislike')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-tight transition-all ${(preferences.dislikedFlavors || []).includes(flavor)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-indigo-300 border-indigo-50'
                  }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceManager;
