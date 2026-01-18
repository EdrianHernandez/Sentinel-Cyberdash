import { GoogleGenAI } from "@google/genai";
import { Incident } from "../types";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const analyzeThreat = async (incident: Incident): Promise<string> => {
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