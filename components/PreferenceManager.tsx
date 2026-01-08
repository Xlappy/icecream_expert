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

  return (
    <div className="space-y-10">
      {/* Стилі */}
      <div>
        <label className="block font-display text-2xl text-choco text-center mb-6 underline decoration-cherry-red decoration-4">ЯКИЙ СТИЛЬ ОБЕРЕТЕ?</label>
        <div className="flex flex-wrap gap-3 justify-center">
          {ICE_CREAM_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleStyle(type)}
              className={`px-6 py-2 border-4 border-choco font-display text-sm tracking-widest transition-all ${preferences.likedStyles.includes(type)
                  ? 'bg-diner-blue text-choco shadow-retro-sm translate-y-[-2px]'
                  : 'bg-white text-choco/40 hover:bg-neutral-50'
                }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${compact && !showAdvanced ? 'hidden' : ''}`}>
        {/* Ціна */}
        <div className="retro-card p-6 bg-white border-2">
          <div className="flex justify-between items-end mb-4">
            <label className="font-display text-lg text-choco uppercase">МАКС. ЦІНА</label>
            <span className="bg-diner-yellow px-4 py-1 border-4 border-choco font-display text-2xl rotate-3">{preferences.priceRange[1]} ₴</span>
          </div>
          <input
            type="range" min="30" max="500" step="10"
            value={preferences.priceRange[1]}
            onChange={(e) => onChange({ ...preferences, priceRange: [preferences.priceRange[0], Number(e.target.value)] })}
            className="w-full h-8 accent-cherry-red appearance-none bg-diner-blue/20 rounded-full border-4 border-choco"
          />
        </div>

        {/* Калорії */}
        <div className="retro-card p-6 bg-white border-2">
          <div className="flex justify-between items-end mb-4">
            <label className="font-display text-lg text-choco uppercase">КАЛОРІЇ (ДО)</label>
            <span className="bg-diner-pink px-4 py-1 border-4 border-choco font-display text-2xl rotate-[-3deg]">{preferences.calorieRange[1]}</span>
          </div>
          <input
            type="range" min="50" max="1000" step="20"
            value={preferences.calorieRange[1]}
            onChange={(e) => onChange({ ...preferences, calorieRange: [preferences.calorieRange[0], Number(e.target.value)] })}
            className="w-full h-8 accent-cherry-red appearance-none bg-diner-blue/20 rounded-full border-4 border-choco"
          />
        </div>

        {/* Жирність */}
        <div className="md:col-span-2 text-center">
          <label className="block font-display text-lg text-choco uppercase mb-4">БАЖАНА ЖИРНІСТЬ</label>
          <div className="flex gap-4 justify-center">
            {[1, 2, 3, 4, 5].map(b => (
              <button
                key={b}
                onClick={() => onChange({ ...preferences, preferredFatContent: b })}
                className={`w-14 h-14 border-4 border-choco font-display text-2xl transition-all rounded-full flex items-center justify-center ${preferences.preferredFatContent === b
                    ? 'bg-cherry-red text-white shadow-retro scale-110'
                    : 'bg-white text-choco/20'
                  }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {compact && (
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full font-bold text-choco underline decoration-diner-blue decoration-4 underline-offset-8 py-4"
        >
          {showAdvanced ? 'МЕНШЕ ФІЛЬТРІВ ↑' : 'БІЛЬШЕ ПАРАМЕТРИВ ↓'}
        </button>
      )}

      {(!compact || showAdvanced) && (
        <div className="space-y-12 animate-fadeIn">
          <div>
            <label className="block font-display text-2xl text-choco text-center mb-8 underline decoration-diner-blue decoration-4">УЛЮБЛЕНІ СМАКИ</label>
            <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-4 custom-scrollbar bg-cream/50 rounded-xl border-4 border-choco border-dashed">
              {POPULAR_FLAVORS.map(flavor => (
                <button
                  key={flavor}
                  onClick={() => toggleFlavor(flavor, 'like')}
                  className={`px-4 py-2 border-2 border-choco font-body font-bold text-xs uppercase tracking-tighter transition-all ${preferences.favoriteFlavors.includes(flavor)
                      ? 'bg-diner-blue text-choco shadow-retro-sm translate-y-[-1px]'
                      : 'bg-white text-choco/40 hover:bg-neutral-50'
                    }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          <div className="relative pt-12">
            <div className="absolute top-0 left-0 w-full h-2 bg-choco/10 blur-[1px]"></div>
            <label className="block font-display text-2xl text-cherry-red text-center mb-8">ІГНОРУВАТИ СМАКИ</label>
            <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-4 custom-scrollbar bg-cream/50 rounded-xl border-4 border-choco border-dashed">
              {POPULAR_FLAVORS.map(flavor => (
                <button
                  key={flavor}
                  onClick={() => toggleFlavor(flavor, 'dislike')}
                  className={`px-4 py-2 border-2 border-choco font-body font-bold text-xs uppercase tracking-tighter transition-all ${(preferences.dislikedFlavors || []).includes(flavor)
                      ? 'bg-cherry-red text-white shadow-retro-sm translate-y-[-1px]'
                      : 'bg-cream text-choco/20'
                    }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferenceManager;
