
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { IceCream, UserPreferences, Recommendation, AppView } from './types';
import { INITIAL_ICE_CREAMS } from './constants';
import { IceCreamExpertService } from './services/iceCreamExpertService';
import IceCreamTable from './components/IceCreamTable';
import PreferenceManager from './components/PreferenceManager';
import IceCreamModal from './components/IceCreamModal';
import ReplacementModal from './components/ReplacementModal';
import AddIceCreamModal from './components/AddIceCreamModal';

type DatabaseSubView = 'classic' | 'gelato' | 'sorbet' | 'soft' | 'vegan' | 'yogurt' | 'sherbet' | 'mochi';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('expert');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView>('classic');
  const [items, setItems] = useState<IceCream[]>(() => {
    const saved = localStorage.getItem('iceexpert_db');
    return saved ? JSON.parse(saved) : INITIAL_ICE_CREAMS;
  });
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

  useEffect(() => {
    localStorage.setItem('iceexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('iceexpert_db', JSON.stringify(items));
  }, [items]);

  const expert = useMemo(() => new IceCreamExpertService(), []);

  const fetchRecommendations = useCallback(() => {
    setLoading(true);
    if (!hasAnalyzed) {
      setTimeout(() => setHasAnalyzed(true), 200);
    }

    setTimeout(() => {
      const recs = expert.getRecommendations(items, preferences);
      setRecommendations(recs.slice(0, 3));
      setLoading(false);
    }, 1000);
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

  const resetDatabase = () => {
    if (window.confirm('Ви впевнені, що хочете скинути базу даних до початкового стану? Всі ваші зміни буде видалено.')) {
      setItems(INITIAL_ICE_CREAMS);
      localStorage.removeItem('iceexpert_db');
      window.location.reload();
    }
  };

  const autoReplace = (oldId: string) => {
    const currentIds = recommendations.map(r => r.iceCreamId);
    const alternativesRecs = expert.getRecommendations(items, preferences, currentIds);
    if (alternativesRecs.length > 0) {
      setRecommendations(prev => prev.map(r => r.iceCreamId === oldId ? alternativesRecs[0] : r));
    }
    setReplacingId(null);
  };

  const manualReplace = (oldId: string, newItemId: string) => {
    const currentIds = recommendations.map(r => r.iceCreamId);
    const allCandidates = expert.getRecommendations(items, preferences, currentIds.filter(id => id !== oldId));
    const newRec = allCandidates.find(r => r.iceCreamId === newItemId);
    if (newRec) {
      setRecommendations(prev => prev.map(r => r.iceCreamId === oldId ? newRec : r));
    }
    setReplacingId(null);
  };

  const updateItemList = (updatedItems: IceCream[]) => {
    setItems(prev => {
      const updatedMap = new Map(prev.map(i => [i.id, i]));
      updatedItems.forEach(i => updatedMap.set(i.id, i));
      return Array.from(updatedMap.values());
    });
  };

  const filteredDatabase = useMemo(() => {
    switch (dbSubView) {
      case 'classic': return items.filter(i => i.type === 'Classic');
      case 'gelato': return items.filter(i => i.type === 'Gelato');
      case 'sorbet': return items.filter(i => i.type === 'Sorbet');
      case 'soft': return items.filter(i => i.type === 'Soft Serve');
      case 'vegan': return items.filter(i => i.type === 'Vegan');
      case 'yogurt': return items.filter(i => i.type === 'Frozen Yogurt');
      case 'sherbet': return items.filter(i => i.type === 'Sherbet');
      case 'mochi': return items.filter(i => i.type === 'Mochi');
      default: return items;
    }
  }, [items, dbSubView]);

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
    <div className="min-h-screen selection:bg-indigo-100 pb-24 font-['Montserrat'] bg-neutral-50/50">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-sky-50/20 to-neutral-50/50 -z-10" />

      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-3xl border-b border-indigo-50/50 sticky top-0 z-[70] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => { setView('expert'); setHasAnalyzed(false); setRecommendations([]); }}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-200 shadow-xl rotate-3 transition-all group-hover:rotate-0 group-hover:scale-110">
              <span className="text-white font-black text-xl italic">i</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-indigo-950 leading-none tracking-tight">ICE-EXPERT</h1>
              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-0.5">Professional Gourmet Guide</p>
            </div>
          </div>
          <div className="flex bg-neutral-100/50 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-200/20">
            {[
              { id: 'expert', label: 'Підбір' },
              { id: 'database', label: 'База' },
              { id: 'favorites', label: `Колекція (${favorites.length})` },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id as AppView)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${view === btn.id
                  ? 'bg-white text-indigo-950 shadow-sm border border-indigo-50'
                  : 'text-indigo-400 hover:text-indigo-900 hover:bg-white/40'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-10 px-6">
        {view === 'favorites' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase">Ваша Колекція</h2>
              <div className="h-px flex-grow bg-indigo-100" />
            </div>
            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteItems.map(item => (
                  <div key={item.id} onClick={() => setSelectedItemId(item.id)} className="bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner">{getItemIcon(item.type)}</div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">❤️</button>
                    </div>
                    <h3 className="font-black text-2xl text-indigo-950 mb-1 leading-tight tracking-tight uppercase">{item.name}</h3>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.15em]">{item.brand} • {item.calories} ккал</p>
                    <div className="mt-8 pt-6 border-t border-indigo-50/50 flex justify-between items-center">
                      <span className="text-indigo-950 font-black text-2xl tracking-tighter">{item.price} ₴</span>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Докладніше</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 border-2 border-dashed border-indigo-100 rounded-[4rem] bg-white/20 backdrop-blur-sm">
                <div className="text-4xl mb-4 opacity-20">🧊</div>
                <p className="text-indigo-300 font-black uppercase tracking-[0.2em] text-[11px]">Колекція порожня</p>
              </div>
            )}
          </div>
        )}

        {view === 'database' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase mb-2">Реєстр Десертів</h2>
                <p className="text-xs font-medium text-indigo-400">Управління глобальною базою даних морозива</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap p-1.5 bg-neutral-200/30 backdrop-blur-md rounded-2xl border border-neutral-200/50">
                  {['classic', 'gelato', 'sorbet', 'soft', 'vegan', 'yogurt', 'sherbet', 'mochi'].map(sub => (
                    <button key={sub} onClick={() => setDbSubView(sub as DatabaseSubView)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${dbSubView === sub ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}>{sub}</button>
                  ))}
                </div>
                <button onClick={resetDatabase} className="h-[46px] px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-500 border-2 border-rose-100 hover:bg-rose-50 transition-all">Очистити Кеш / Reset</button>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white h-[46px] px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">+ Новий запис</button>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-1 border border-white shadow-xl shadow-indigo-50/20">
              <IceCreamTable items={filteredDatabase} onUpdate={updateItemList} title="Базовий каталог" />
            </div>
          </div>
        )}

        {view === 'expert' && (
          <div className="relative">
            <div className={`flex flex-col lg:flex-row gap-12 transition-all duration-700 ${hasAnalyzed ? 'items-start' : 'items-center justify-center pt-12 md:pt-24'}`}>

              <div className={`transition-all duration-700 ${hasAnalyzed ? 'lg:w-[350px] w-full shrink-0 sticky top-28' : 'max-w-3xl w-full text-center'}`}>
                {!hasAnalyzed && (
                  <div className="mb-14 animate-fadeIn">
                    <div className="inline-block bg-indigo-50 px-6 py-2 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">AI Intelligent Guide</div>
                    <h2 className="text-5xl md:text-7xl font-black text-indigo-950 tracking-tighter mb-6 leading-[0.9] uppercase">ДЕГУСТАЦІЙНИЙ <br /><span className="text-indigo-400">ПРОТОКОЛ</span></h2>
                    <p className="text-indigo-500/70 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed italic">"Ваш персональний навігатор у світі преміальних десертів та авторського морозива."</p>
                  </div>
                )}

                <div className="bg-white/40 backdrop-blur-xl p-1 rounded-[3rem] border border-white shadow-2xl shadow-indigo-100/50">
                  <PreferenceManager preferences={preferences} onChange={setPreferences} compact={!hasAnalyzed} />
                </div>

                <div className={`mt-10 ${!hasAnalyzed ? 'flex justify-center' : ''}`}>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className={`bg-indigo-600 text-white font-black transition-all shadow-2xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-4 ${hasAnalyzed ? 'w-full py-5 rounded-2xl text-[11px]' : 'px-20 py-7 rounded-[3rem] text-xl'
                      } ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-indigo-700 hover:-translate-y-1'}`}
                  >
                    {loading ? <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                    <span className="uppercase tracking-[0.2em]">{hasAnalyzed ? 'Оновити Аналіз' : 'Розпочати Дослідження'}</span>
                  </button>
                </div>
              </div>

              {/* Results Canvas */}
              <div className={`flex-grow w-full transition-all duration-1000 ${hasAnalyzed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute invisible'}`}>
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-indigo-100 pb-8">
                  <div>
                    <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter leading-none">РЕЗУЛЬТАТИ ПІДБОРУ</h3>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-3">НА ОСНОВІ ВАШИХ УПОДОБАНЬ ТА СМАКОВОГО ПРОФІЛЮ</p>
                  </div>
                  <div className="bg-indigo-50 px-5 py-2.5 rounded-2xl border border-indigo-100 flex items-center gap-3">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Optimal Session Ready</span>
                  </div>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {recommendations.map((rec) => {
                      const item = items.find(i => i.id === rec.iceCreamId);
                      if (!item) return null;

                      return (
                        <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-[3.5rem] border border-white flex flex-col overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 animate-fadeIn group h-full shadow-lg">
                          <div className="p-10 pb-6 relative bg-gradient-to-b from-indigo-50/50 to-transparent">
                            <div className="flex justify-between items-center mb-8">
                              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-indigo-50/50 group-hover:scale-110 transition-transform">{getItemIcon(item.type)}</div>
                              <div className="text-right">
                                <div className="text-2xl font-black text-indigo-950 tracking-tighter">{item.price} ₴</div>
                                <div className="text-[9px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-50 mt-1 uppercase tracking-tighter">SCORE: {rec.score}%</div>
                              </div>
                            </div>
                            <h3 className="font-black text-2xl text-indigo-950 mb-2 leading-tight uppercase line-clamp-2 min-h-[3.5rem] tracking-tight">{item.name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.1em]">
                              <span className="text-indigo-600">{item.brand}</span>
                              <span className="opacity-30">•</span>
                              <span>{item.calories} ккал</span>
                            </div>
                          </div>

                          <div className="p-10 pt-4 flex-grow flex flex-col">
                            <div className="bg-white/50 p-6 rounded-[2.5rem] border border-indigo-50/30 mb-8 flex-grow shadow-inner">
                              <p className="text-[14px] text-indigo-900/80 leading-relaxed font-medium italic line-clamp-5">
                                "{rec.explanation}"
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Fat Index</span>
                                <div className="flex gap-1.5">
                                  {[1, 2, 3, 4, 5].map(b => <div key={b} className={`h-1.5 flex-1 rounded-full transition-all ${item.fatContent >= b ? 'bg-indigo-600' : 'bg-indigo-50'}`}></div>)}
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">Base</span>
                                <span className="text-[10px] font-black text-indigo-950 uppercase truncate bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100/50">{item.baseIngredient}</span>
                              </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                              <button
                                onClick={() => setSelectedItemId(item.id)}
                                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                              >
                                Докладно
                              </button>
                              <button
                                onClick={() => setReplacingId(item.id)}
                                className="flex-1 bg-white text-indigo-400 border border-indigo-100 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-indigo-900 hover:bg-neutral-50 transition-all active:scale-95"
                              >
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-48 border-2 border-dashed border-indigo-100 rounded-[5rem] px-10 text-center bg-white/20 backdrop-blur-sm">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-6xl mb-8 animate-bounce opacity-30 shadow-inner">🍦</div>
                    <h3 className="text-3xl font-black text-indigo-950 mb-3 tracking-tighter uppercase">База порожня</h3>
                    <p className="text-indigo-400 text-sm max-w-sm font-medium leading-relaxed italic">"Ваши критерії занадто специфічні або ми не знайшли відповідних десертів у реєстрі."</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-5 px-10 bg-white/40 backdrop-blur-3xl border-t border-white z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200"></span> GOURMET ENGINE ACTIVE</span>
            <span className="opacity-40 hidden sm:inline">ICE-DATABASE VERSION 2.1.4_R</span>
          </div>
          <div className="flex items-center gap-2 lowercase font-bold text-indigo-500">
            ice-expert pro <span className="text-[9px] not-italic uppercase font-black text-indigo-950 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">gourmet edition</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedItem && (
        <IceCreamModal iceCream={selectedItem} isOpen={!!selectedItemId} onClose={() => setSelectedItemId(null)} isFavorite={favorites.includes(selectedItem.id)} onToggleFavorite={toggleFavorite} />
      )}
      {replacingItem && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalItem={replacingItem} alternatives={alternatives} allItems={items} onSelect={(newId) => manualReplace(replacingId!, newId)} onAutoSelect={() => autoReplace(replacingId!)} />
      )}
      <AddIceCreamModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addItem} />
    </div>
  );
};

export default App;

