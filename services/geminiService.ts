import { GoogleGenAI, Type } from "@google/genai";
import { Trend, GeneratedContent, Tone } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Step 1: Scan for Trends using Google Search Grounding
 */
export const scanForTrends = async (): Promise<Trend[]> => {
  try {
    const model = 'gemini-3-flash-preview'; 
    const prompt = `
      Find 3 distinct, trending technical developments from the last 24-48 hours related to:
      Agentic AI, RAG architectures, LLM optimization, or Data Analytics.
      
      For each development, provide:
      1. A catchy headline.
      2. The primary source name.
      3. A technical summary (2 sentences).
      4. The "Business Impact" (Why a CTO or Founder should care).
      
      Return the response as a JSON array.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              summary: { type: Type.STRING },
              businessImpact: { type: Type.STRING },
            },
            required: ['title', 'source', 'summary', 'businessImpact']
          }
        }
      }
    });

    const trendsData = JSON.parse(response.text || '[]');
    
    // Extract URLs from grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let webUrls: string[] = [];
    
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        webUrls.push(chunk.web.uri);
      }
    });

    // Map to Trend interface, attaching a relevant URL if possible (simplistic mapping)
    return trendsData.map((t: any, index: number) => ({
      ...t,
      id: generateId(),
      url: webUrls[index] || webUrls[0] || '' // Fallback mapping
    }));

  } catch (error) {
    console.error("Error scanning trends:", error);
    throw error;
  }
};

/**
 * Step 2: Generate LinkedIn Post & Image Prompt
 */
export const generateContent = async (trend: Trend, tone: Tone): Promise<GeneratedContent> => {
  try {
    const model = 'gemini-3-pro-preview'; // Using Pro for better reasoning/writing quality
    
    let toneInstruction = "";
    switch (tone) {
      case 'Technical': toneInstruction = "Use deep engineering terminology. Focus on architecture and performance metrics. Assume the reader is a Senior Engineer."; break;
      case 'Skeptical': toneInstruction = "Adopt a critical lens. Question the hype. Look for potential bottlenecks, costs, or implementation challenges."; break;
      case 'Beginner-Friendly': toneInstruction = "Use analogies. Explain complex terms (like RAG or Agentic) simply. Focus on the high-level benefit."; break;
      default: toneInstruction = "Balance technical credibility with executive readability. High-signal, low-fluff."; break;
    }

    const prompt = `
      You are a top-tier LinkedIn Ghostwriter for AI thought leaders.
      
      Context:
      Title: ${trend.title}
      Summary: ${trend.summary}
      Impact: ${trend.businessImpact}
      
      Task: Create a viral LinkedIn post and visual brief based on this news.
      Tone: ${toneInstruction}
      
      Format Constraints:
      1. Hook: Aggressive, short, stops the scroll. No "In today's news...".
      2. Body: Use whitespace. Bullet points for value.
      3. Closing: Engagement-driving question.
      
      Output JSON with:
      - post: The full text of the post.
      - hashtags: Array of 5 hashtags.
      - firstComment: A smart follow-up comment to add immediately after posting.
      - imagePrompt: A detailed text-to-image prompt for a high-end, abstract, tech-focused visual that represents this concept. Minimalist, geometric, 3D render style.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            post: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            firstComment: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ['post', 'hashtags', 'firstComment', 'imagePrompt']
        }
      }
    });

    return JSON.parse(response.text || '{}');

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

/**
 * Step 3: Generate Image from Prompt
 */
export const generateImage = async (imagePrompt: string): Promise<string | null> => {
  try {
    // User specifically requested gemini-2.5-flash-image
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
         // Note: responseMimeType is not supported for nano banana series models
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          // Assuming PNG based on typical output, but could check mimeType if provided
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
