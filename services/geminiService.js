import { GoogleGenAI } from "@google/genai";
// Removed TypeScript type import

let ai = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

// Removed type annotations for 'incident' parameter and Promise return type
export const analyzeThreat = async (incident) => {
  if (!ai) {
    throw new Error("API Key not found");
  }

  const prompt = `
    Analyze the following cybersecurity incident log. 
    Provide a brief, technical situation report for a Security Operations Center analyst.
    Use high-tech, military-grade or cyberpunk terminology.
    Keep it under 3 sentences.
    
    Incident Details:
    ID: ${incident.id}
    Type: ${incident.type}
    Source IP: ${incident.sourceIp}
    Target System: ${incident.target}
    Severity: ${incident.severity}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "NO ANALYSIS DATA RETURNED.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
