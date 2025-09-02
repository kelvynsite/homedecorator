import { GoogleGenAI, Modality } from "@google/genai";
import type { GroundingChunk, ProductLink } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ImagePart {
  data: string;
  mimeType: string;
}

interface DecorateResult {
  generatedImage: string | null;
  description: string | null;
  productLinks: ProductLink[];
}

export const decorateAndFindProducts = async (
  userPrompt: string,
  image: ImagePart
): Promise<DecorateResult> => {
  try {
    const imageEditingModel = 'gemini-2.5-flash-image-preview';
    const searchModel = 'gemini-2.5-flash';

    // Step 1: Get decoration ideas and product links. Create a detailed prompt for the image editor.
    const findProductsAndIdeasPrompt = `O usuário quer redecorar um ambiente no Brasil. O pedido dele é: "${userPrompt}".
Responda em português do Brasil.
Com base no pedido, faça duas coisas:
1. Gere um parágrafo conciso e descritivo que possa ser usado como um prompt para um editor de imagens de IA. Esta descrição deve detalhar as mudanças visuais específicas a serem feitas no ambiente. Por exemplo: "Adicione um confortável sofá seccional azul-marinho no centro da sala. Coloque uma mesa de centro redonda de carvalho claro na frente dele. No canto, perto da janela, adicione uma planta alta Ficus lyrata em um vaso de cerâmica branca. Substitua a arte de parede atual por uma grande pintura abstrata com tons de azul e dourado."
2. Encontre produtos relevantes online que correspondam a essas ideias de decoração. **Dê preferência a lojas e sites de e-commerce brasileiros.**`;

    const searchResponse = await ai.models.generateContent({
      model: searchModel,
      contents: findProductsAndIdeasPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const description = searchResponse.text;
    if (!description) {
        throw new Error("Não foi possível gerar ideias de decoração. Por favor, tente um prompt diferente.");
    }

    // Step 2: Use the generated description to edit the image
    const editResponse = await ai.models.generateContent({
      model: imageEditingModel,
      contents: {
        parts: [
          { inlineData: { data: image.data, mimeType: image.mimeType } },
          { text: description }, // Use the detailed description from the first API call
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Process image editing response
    let generatedImage: string | null = null;
    if (editResponse.candidates && editResponse.candidates[0].content.parts) {
      for (const part of editResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImage = part.inlineData.data;
        }
      }
    }
    
    // Process product search response
    const productLinks: ProductLink[] = [];
    const groundingChunks: GroundingChunk[] | undefined = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        // FIX: Filter for chunks with a web URI and provide a fallback title to prevent type errors.
        groundingChunks.forEach(chunk => {
            if (chunk.web && chunk.web.uri) {
                productLinks.push({ uri: chunk.web.uri, title: chunk.web.title || 'Ver Produto' });
            }
        });
    }

    return { generatedImage, description, productLinks };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Falha ao processar sua solicitação: ${error.message}`);
    }
    throw new Error("Ocorreu um erro inesperado ao contatar o serviço de IA.");
  }
};