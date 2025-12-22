

export interface IceCream {
  id: string;
  name: string;
  type: 'Classic' | 'Gelato' | 'Sorbet' | 'Soft Serve' | 'Vegan' | 'Frozen Yogurt' | 'Sherbet' | 'Mochi';
  origin: 'Local' | 'Imported';
  baseIngredient: string;
  brand: string;
  calories: number;
  fatContent: number; // 1-5
  texture: number; // 1-5
  acidity: number; // 1-5
  sweetness: number; // 1-5
  temperature: string;
  flavor: string;
  toppingPairing: string;
  price: number;
  shelfLifeDays: number;
}

export interface UserPreferences {
  likedStyles: string[];
  dislikedBases: string[];
  priceRange: [number, number];
  calorieRange: [number, number];
  favoriteFlavors: string[];
  dislikedFlavors: string[];
  preferredBrands: string[];
  minShelfLife: number;
  preferredFatContent: number;
}

export interface Recommendation {
  iceCreamId: string;
  explanation: string;
  score?: number;
}

export type AppView = 'expert' | 'database' | 'favorites';

