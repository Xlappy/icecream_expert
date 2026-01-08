import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { IceCream, UserPreferences, Recommendation, AppView } from './types';
import { IceCreamExpertService } from './services/iceCreamExpertService';
import IceCreamTable from './components/IceCreamTable';
import PreferenceManager from './components/PreferenceManager';
import IceCreamModal from './components/IceCreamModal';
import ReplacementModal from './components/ReplacementModal';
import AddIceCreamModal from './components/AddIceCreamModal';

type DatabaseSubView = 'classic' | 'gelato' | 'sorbet' | 'soft' | 'vegan' | 'yogurt' | 'sherbet' | 'mochi';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('expert');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView | 'all'>('all');
  const [items, setItems] = useState<IceCream[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IceCream[] | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    likedStyles: ['Classic'],
    dislikedBases: [],
    priceRange: [20, 300],
    calorieRange: [50, 500],
    favoriteFlavors: ['Ваніль', 'Шоколад'],
    dislikedFlavors: [],
    preferredBrands: [],
    minShelfLife: 0,
    preferredFatContent: 3,
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('iceexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const expert = useMemo(() => new IceCreamExpertService(), []);

  // Initial load from Backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await expert.getAllIceCreams();
      setItems(data);
      setLoading(false);
    };
    loadData();
  }, [expert]);

  useEffect(() => {
    localStorage.setItem('iceexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    const results = await expert.searchIceCreams(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  const fetchRecommendations = useCallback(() => {
    setLoading(true);
    if (!hasAnalyzed) {
      setHasAnalyzed(true);
    }
    setTimeout(() => {
      const recs = expert.getRecommendations(items, preferences);
      setRecommendations(recs.slice(0, 3));
      setLoading(false);
    }, 800);
  }, [items, preferences, expert, hasAnalyzed]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addItem = (newItem: IceCream) => {
    setItems(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  const updateItemList = (updatedItems: IceCream[]) => {
    setItems(prev => {
      const updatedMap = new Map(prev.map(i => [i.id, i]));
      updatedItems.forEach(i => updatedMap.set(i.id, i));
      return Array.from(updatedMap.values());
    });
  };

  const [dbPriceLimit, setDbPriceLimit] = useState(500);

  const filteredDatabase = useMemo(() => {
    let base = searchResults || items;

    // 1. Filter by category
    if (dbSubView !== 'all') {
      const typeMap: Record<string, string> = {
        'classic': 'Classic', 'gelato': 'Gelato', 'sorbet': 'Sorbet',
        'soft': 'Soft Serve', 'vegan': 'Vegan', 'yogurt': 'Frozen Yogurt',
        'sherbet': 'Sherbet', 'mochi': 'Mochi'
      };
      base = base.filter(i => i.type === typeMap[dbSubView]);
    }

    // 2. Filter by price
    return base.filter(i => i.price <= dbPriceLimit);
  }, [items, dbSubView, searchResults, dbPriceLimit]);

  const favoriteItems = useMemo(() => {
    return items.filter(i => favorites.includes(i.id));
  }, [items, favorites]);

  const alternatives = useMemo(() => {
    if (!replacingId) return [];
    const currentIds = recommendations.map(r => r.iceCreamId);
    return expert.getRecommendations(items, preferences, currentIds);
  }, [replacingId, items, preferences, recommendations, expert]);

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

  const selectedItem = useMemo(() => items.find(i => i.id === selectedItemId), [items, selectedItemId]);
  const replacingItem = useMemo(() => items.find(i => i.id === replacingId), [items, replacingId]);

  return (
    <div className="min-h-screen relative flex">
      {/* 
          UNCONVENTIONAL NAVIGATION 
          Side-menu styled as an "order ticket holder" or table service labels.
      */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] flex flex-col gap-6">
        {[
          { id: 'expert', label: 'ЗАМОВИТИ', color: 'bg-cream' },
          { id: 'database', label: 'МЕНЮ (DB)', color: 'bg-diner-yellow' },
          { id: 'favorites', label: 'ВИБРАНЕ', color: 'bg-diner-pink' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setView(btn.id as AppView)}
            className={`w-32 h-32 flex flex-col items-center justify-center p-4 border-4 border-choco shadow-retro transition-all hover:scale-105 active:translate-y-2 active:shadow-none ${btn.color} ${view === btn.id ? 'translate-x-[-10px] scale-110' : 'opacity-80'
              }`}
            style={{ borderRadius: '20px 0 20px 0' }}
          >
            <span className="font-display text-xs text-choco mb-2">№{Math.floor(Math.random() * 99)}</span>
            <span className="font-display text-sm text-center leading-tight text-choco">{btn.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow pr-40">
        <header className="p-10 border-b-8 border-choco flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-cherry-red rounded-full border-4 border-choco flex items-center justify-center shadow-retro-sm">
              <span className="text-white text-4xl font-display">D</span>
            </div>
            <div>
              <h1 className="text-6xl neon-text">50's DINER</h1>
              <p className="font-body font-bold text-sm uppercase tracking-[0.5em] text-choco/40">Gourmet SQL Registry</p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-12">
          {/* SEARCH ONLY IN DATABASE VIEW */}
          {view === 'database' && (
            <div className="mb-12 animate-fadeIn">
              <div className="bg-choco p-2 border-4 border-choco shadow-retro">
                <form onSubmit={handleSearch} className="flex gap-0 border-4 border-white">
                  <input
                    type="text"
                    placeholder="ПОШУК ПО SQL БАЗІ ДАНИХ..."
                    className="flex-grow p-4 bg-cream font-body font-bold text-choco outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="bg-white px-8 font-display text-choco hover:bg-diner-yellow transition-colors whitespace-nowrap">
                    ЗНАЙТИ
                  </button>
                </form>
              </div>
              {searchResults && (
                <button
                  onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                  className="mt-4 text-choco font-bold underline"
                >
                  Скинути пошук
                </button>
              )}
            </div>
          )}

          {view === 'favorites' && (
            <div className="space-y-12 animate-fadeIn pr-10">
              <h2 className="text-7xl text-choco text-center">ВАШІ ЧЕКИ</h2>
              {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 cursor-alias">
                  {favoriteItems.map(item => (
                    <div key={item.id} onClick={() => setSelectedItemId(item.id)} className="retro-card p-8 group hover:rotate-1 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="text-6xl">{getItemIcon(item.type)}</div>
                        <span className="font-display text-choco/20 text-4xl italic group-hover:text-cherry-red transition-colors">❤</span>
                      </div>
                      <h3 className="text-3xl text-choco mt-4 uppercase">{item.name}</h3>
                      <div className="mt-8 pt-4 border-t-4 border-choco border-dotted flex justify-between">
                        <span className="font-display text-2xl">{item.price} ₴</span>
                        <span className="font-body font-bold text-choco/40">{item.brand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="retro-card text-center py-20 bg-cream/30">
                  <p className="font-display text-4xl text-choco/20 italic">ПУСТО...</p>
                </div>
              )}
            </div>
          )}

          {view === 'database' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-6xl text-choco transform -rotate-2">РЕЄСТР</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="retro-btn bg-diner-blue hover:bg-diner-pink"
                >
                  + НОВИЙ ЗАПИС
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                  {['all', 'classic', 'gelato', 'sorbet', 'soft', 'vegan', 'yogurt', 'sherbet', 'mochi'].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setDbSubView(sub as any)}
                      className={`px-4 py-1 border-2 border-choco font-display text-[10px] tracking-widest ${dbSubView === sub ? 'bg-choco text-white' : 'bg-cream text-choco/60'
                        }`}
                    >
                      {sub === 'all' ? 'УСЕ' : sub.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="bg-white border-4 border-choco p-3 flex items-center gap-4 shadow-retro-sm">
                  <span className="font-display text-[10px]">ЦІНА ДО: {dbPriceLimit} ₴</span>
                  <input
                    type="range" min="30" max="500" step="10"
                    value={dbPriceLimit}
                    onChange={(e) => setDbPriceLimit(Number(e.target.value))}
                    className="accent-cherry-red cursor-pointer"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <IceCreamTable items={filteredDatabase} onUpdate={updateItemList} title={searchResults ? "РЕЗУЛЬТАТИ" : "КАТАЛОГ СМАКІВ"} />
              </div>
            </div>
          )}

          {view === 'expert' && (
            <div className="animate-fadeIn">
              {!hasAnalyzed ? (
                <div className="max-w-3xl mx-auto space-y-10">
                  <div className="text-center">
                    <h2 className="text-8xl text-choco font-display leading-[0.8]">
                      ДОПОМОГА <br />
                      <span className="text-cherry-red uppercase">ЕКСПЕРТА</span>
                    </h2>
                  </div>

                  <div className="retro-card p-10 bg-cream relative">
                    <div className="absolute -top-6 -left-6 bg-diner-yellow w-20 h-10 border-4 border-choco flex items-center justify-center font-display text-xs rotate-[-15deg] shadow-retro-sm">
                      ORDER #1
                    </div>
                    <PreferenceManager preferences={preferences} onChange={setPreferences} compact={true} />
                    <button
                      onClick={fetchRecommendations}
                      disabled={loading}
                      className="retro-btn mt-12 text-5xl w-full py-8 bg-choco text-white hover:bg-cherry-red"
                    >
                      {loading ? 'АНАЛІЗ...' : 'ЗАМОВИТИ'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="flex justify-between items-end">
                    <h2 className="text-5xl text-choco font-display uppercase tracking-tighter">НАЙКРАЩІ ПОЄДНАННЯ</h2>
                    <button
                      onClick={() => setHasAnalyzed(false)}
                      className="text-choco font-black underline decoration-cherry-red decoration-4"
                    >
                      ← ЗМІНИТИ ПАРАМЕТРИ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pr-12">
                    {recommendations.map((rec) => {
                      const item = items.find(i => i.id === rec.iceCreamId);
                      if (!item) return null;
                      return (
                        <div key={item.id} className="retro-card flex flex-col h-full bg-cream transform transition-transform hover:-translate-y-2">
                          <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between mb-4">
                              <span className="text-6xl">{getItemIcon(item.type)}</span>
                              <div className="text-right">
                                <div className="font-display text-cherry-red text-xl">FIT: {rec.score}%</div>
                                <div className="font-display text-2xl">{item.price} ₴</div>
                              </div>
                            </div>
                            <h3 className="text-2xl text-choco mb-2 uppercase leading-none">{item.name}</h3>
                            <p className="text-choco/30 font-bold mb-4 uppercase text-[10px]">{item.brand}</p>
                            <div className="bg-white p-4 border-4 border-choco border-dotted italic text-sm font-bold flex-grow mb-6">
                              "{rec.explanation}"
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedItemId(item.id)} className="retro-btn flex-grow py-2 text-sm bg-diner-blue">ОГЛЯНУТИ</button>
                              <button onClick={() => setReplacingId(item.id)} className="retro-btn py-2 text-sm bg-white">🔄</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Polka dot bg overlay */}
      <footer className="fixed bottom-0 left-0 w-full h-12 checkerboard opacity-20 z-[-1]"></footer>

      {/* Modals */}
      {selectedItem && (
        <IceCreamModal iceCream={selectedItem} isOpen={!!selectedItemId} onClose={() => setSelectedItemId(null)} isFavorite={favorites.includes(selectedItem.id)} onToggleFavorite={toggleFavorite} />
      )}
      {replacingItem && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalItem={replacingItem} alternatives={alternatives} allItems={items} onSelect={(newId) => manualReplace(replacingId!, newId)} onAutoSelect={() => autoReplace(replacingId!)} />
      )}
      <AddIceCreamModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addItem} />

      {loading && (
        <div className="fixed inset-0 bg-choco/60 z-[300] flex items-center justify-center">
          <div className="bg-white p-10 border-8 border-choco shadow-retro animate-bounce text-center">
            <div className="text-8xl mb-4">🍨</div>
            <div className="font-display text-3xl">GOURMET ANALYTICS...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
