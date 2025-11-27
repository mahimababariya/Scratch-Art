import { GoogleGenAI } from "@google/genai";
import { GeneratedImagePart, GenerationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash-image";

/**
 * Generates a new sketch based on a text prompt.
 */
export const generateSketch = async (prompt: string, config: GenerationConfig): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Create a high-quality, realistic pencil sketch art of: ${prompt}. The style should be detailed, monochromatic (graphite/charcoal on paper), with strong shading and artistic strokes. Do not include photorealistic color, keep it looking like a traditional sketch.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated.");
    }

    const content = candidates[0].content;
    let imageUrl = "";

    // The API might return text parts alongside image parts. We need to find the image.
    if (content.parts) {
      for (const part of content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Assuming PNG as default from Gemini 2.5 Flash Image, but could be JPEG.
          // The mimeType is usually provided in inlineData.
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Model response did not contain an image.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating sketch:", error);
    throw error;
  }
};

/**
 * Edits an existing sketch based on a new instruction.
 */
export const editSketch = async (
  currentImageUrl: string, 
  editInstruction: string
): Promise<string> => {
  try {
    // Extract base64 data and mimeType from the data URL
    const match = currentImageUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image data URL");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Edit this sketch based on the following instruction: ${editInstruction}. Maintain the realistic pencil sketch style consistently. Do not convert it to a photograph.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated.");
    }

    const content = candidates[0].content;
    let newImageUrl = "";

    if (content.parts) {
      for (const part of content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const respMimeType = part.inlineData.mimeType || "image/png";
          newImageUrl = `data:${respMimeType};base64,${base64EncodeString}`;
          break;
        }
      }
    }

    if (!newImageUrl) {
      throw new Error("Model response did not contain an image.");
    }

    return newImageUrl;

  } catch (error) {
    console.error("Error editing sketch:", error);
    throw error;
  }
};