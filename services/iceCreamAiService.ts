
import { GoogleGenAI, Type } from "@google/genai";
import { IceCream, UserPreferences, Recommendation } from "../types";

export class IceCreamAiService {
  private ai: GoogleGenAI;

  constructor() {
    // Note: In a real app, API_KEY should be in environment variables
    this.ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
  }

  async getRecommendations(
    items: IceCream[],
    preferences: UserPreferences,
    feedback?: { rejectedId: string, reason: string }
  ): Promise<Recommendation[]> {
    const prompt = `
      Ти — світовий експерт з десертів та морозива. Твоє завдання — надати професійну пораду українською мовою.
      
      Доступна база морозива: ${JSON.stringify(items)}
      
      Уподобання користувача:
      - Стилі: ${preferences.likedStyles.join(', ')}
      - Небажані основи: ${preferences.dislikedBases.join(', ')}
      - Діапазон цін: ${preferences.priceRange[0]} - ${preferences.priceRange[1]} грн
      - Улюблені смаки: ${preferences.favoriteFlavors.join(', ')}
      
      ${feedback ? `КРИТИЧНЕ ОНОВЛЕННЯ: Користувач щойно відхилив варіант з ID "${feedback.rejectedId}" через: "${feedback.reason}". Запропонуй заміну, виключивши це морозиво.` : ''}

      Завдання: Рекомендуй рівно 3 види морозива з наданого списку, які найкраще відповідають цим критеріям.
      Якщо відповідних варіантів менше 3, запропонуй найближчі за смаковим профілем.
      Поясни ЧОМУ для кожної рекомендації професійним, але привітним тоном українською мовою.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              iceCreamId: { type: Type.STRING, description: "ID морозива з наданого списку" },
              explanation: { type: Type.STRING, description: "Детальне пояснення українською мовою" }
            },
            required: ["iceCreamId", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse expert response", e);
      return [];
    }
  }
}
