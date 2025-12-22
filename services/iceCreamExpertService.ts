
import { IceCream, UserPreferences, Recommendation } from "../types";

export class IceCreamExpertService {
  /**
   * Локальний алгоритм ранжування морозива на основі уподобань користувача.
   */
  getRecommendations(
    items: IceCream[],
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = items.filter(item => {
      if (excludedIds.includes(item.id)) return false;

      // Жорсткий фільтр: Ціна
      if (item.price > preferences.priceRange[1]) return false;

      // Жорсткий фільтр: Стиль
      if (preferences.likedStyles.length > 0 && !preferences.likedStyles.includes(item.type)) return false;

      // Жорсткий фільтр: Калорії
      if (preferences.calorieRange && item.calories > preferences.calorieRange[1]) return false;

      // Жорсткий фільтр: Термін придатності
      if (preferences.minShelfLife && item.shelfLifeDays < preferences.minShelfLife) return false;

      // Жорсткий фільтр: Небажані смаки
      const iceCreamDataStr = `${item.flavor} ${item.baseIngredient} ${item.name}`.toLowerCase();
      const hasDislikedFlavor = (preferences.dislikedFlavors || []).some(flavor =>
        iceCreamDataStr.includes(flavor.toLowerCase())
      );
      if (hasDislikedFlavor) return false;

      return true;
    });

    const scoredCandidates = candidates.map(item => {
      let score = 0;
      const dataStr = `${item.flavor} ${item.toppingPairing} ${item.baseIngredient} ${item.brand}`.toLowerCase();

      // 1. Улюблені смаки (Вага: +30 за кожний)
      preferences.favoriteFlavors.forEach(flavor => {
        if (dataStr.includes(flavor.toLowerCase())) {
          score += 30;
        }
      });

      // 2. Відповідність жирності (Вага: +40 за ідеальний збіг)
      if (preferences.preferredFatContent) {
        const diff = Math.abs(item.fatContent - preferences.preferredFatContent);
        if (diff === 0) score += 40;
        else if (diff === 1) score += 15;
      }

      // 3. Бонуси за бренд
      if (preferences.preferredBrands && preferences.preferredBrands.length > 0) {
        if (preferences.preferredBrands.some(b => item.brand.includes(b))) {
          score += 20;
        }
      }

      // 4. Поправочний коефіцієнт для текстури
      if (item.texture >= 4) score += 10;

      // Нормалізація скору до 100%
      const finalScore = Math.min(99, Math.round((score / 150) * 100));

      return { item, score: finalScore };
    });

    // Сортування за спаданням релевантності
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(res => ({
      iceCreamId: res.item.id,
      explanation: this.generateExplanation(res.item, preferences, res.score),
      score: res.score
    }));
  }

  private generateExplanation(item: IceCream, prefs: UserPreferences, score: number): string {
    const matchedFlavors = prefs.favoriteFlavors.filter(f =>
      item.flavor.toLowerCase().includes(f.toLowerCase())
    );

    const textureDescriptions: Record<number, string> = {
      1: 'грубою',
      2: 'злегка зернистою',
      3: 'стандартною',
      4: 'кремовою',
      5: 'ідеально гладкою'
    };

    const intro = score > 80
      ? `Це ваш ідеальний десерт! `
      : score > 60
        ? `Чудовий вибір, що точно вам сподобається. `
        : `Цікавий варіант з унікальними нотками. `;

    let analysis = `Це морозиво з ${textureDescriptions[item.texture] || 'приємною'} текстурою. `;

    if (matchedFlavors.length > 0) {
      analysis += `Ви точно оціните ваші улюблені смаки: ${matchedFlavors.slice(0, 3).join(', ')}. `;
    } else {
      analysis += `Вас може зацікавити поєднання ${item.flavor.split(',').slice(0, 2).join(' та ')}. `;
    }

    const pairing = `Рекомендуємо спробувати з ${item.toppingPairing.toLowerCase()}.`;

    return `${intro}${analysis}${pairing}`;
  }
}

