
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInventoryInsights(products: Product[]) {
  try {
    const productSummary = products.map(p => 
      `${p.name} (Stock: ${p.stock}, Price: $${p.price}, Cat: ${p.category})`
    ).join(", ");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional e-commerce analyst. Analyze this inventory: ${productSummary}. 
      Return exactly 3 concise, actionable insights (max 15 words each). 
      Format as a JSON array of strings. Do not include Markdown formatting.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Insight Error:", error);
    return ["Monitor low stock items", "Evaluate pricing for high-inventory products", "Optimize electronics category"];
  }
}

export async function generateProductDescription(name: string, category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, punchy, professional e-commerce product description (max 30 words) for a product named "${name}" in the category "${category}".`,
    });
    return response.text || "";
  } catch (error) {
    return "Failed to generate description.";
  }
}
