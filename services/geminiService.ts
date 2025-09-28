import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const createDynamicPrompt = (
    brushStrokeBoldness: number,
    colorSaturation: number,
    paperTexture: number,
    pencilDetail: number
): string => {
    let prompt = 'Transform this image into a watercolor painting. ';

    // Brush Stroke Boldness
    if (brushStrokeBoldness < 33) {
        prompt += 'Use very fine and delicate brushstrokes for a subtle effect. ';
    } else if (brushStrokeBoldness < 66) {
        prompt += 'Use moderately visible and classic watercolor brushstrokes. ';
    } else {
        prompt += 'Use bold, expressive, and prominent brushstrokes that are a key feature of the style. ';
    }

    // Color Saturation
    if (colorSaturation < 33) {
        prompt += 'The colors should be desaturated and muted, creating a soft, gentle, and somewhat faded look. ';
    } else if (colorSaturation < 66) {
        prompt += 'The colors should have a natural and balanced saturation, true to a classic watercolor style. ';
    } else {
        prompt += 'The colors should be highly saturated, vibrant, and rich, making the painting pop. ';
    }

    // Paper Texture
    if (paperTexture < 33) {
        prompt += 'The paper texture should be smooth and barely visible. ';
    } else if (paperTexture < 66) {
        prompt += 'Incorporate a noticeable, classic cold-press watercolor paper texture with a visible grain. ';
    } else {
        prompt += 'The paper texture should be very heavy and rough, like a rough-press paper, contributing significantly to the final look. ';
    }

    // Pencil detail part
    if (pencilDetail <= 10) {
        prompt += 'There should be almost no visible pencil lines, creating a pure watercolor effect. ';
    } else if (pencilDetail < 50) {
        prompt += 'Incorporate subtle, light pencil sketch lines to define some edges and add a touch of structure. ';
    } else if (pencilDetail < 85) {
        prompt += 'Feature clear and noticeable pencil sketch lines that outline the main subjects, creating a distinct "line and wash" style. ';
    } else {
        prompt += 'Use bold, prominent, and dark pencil or ink lines as a strong foundation, with watercolor washes applied over them. The sketch lines should be a dominant feature of the artwork. ';
    }

    prompt += 'Do not return the original image. The final output must be a new image in the described artistic style.';
    return prompt;
};


/**
 * Converts a given image to a watercolor painting style using the Gemini API.
 * @param base64Image The base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @param brushStrokeBoldness The desired boldness of brush strokes (1-100).
 * @param colorSaturation The desired color saturation (1-100).
 * @param paperTexture The desired visibility of paper texture (1-100).
 * @param pencilDetail The desired level of pencil sketch detail for the output image (0-100).
 * @returns A promise that resolves to the base64 data URL of the watercolor image.
 */
export const convertToWatercolor = async (
    base64Image: string, 
    mimeType: string, 
    brushStrokeBoldness: number,
    colorSaturation: number,
    paperTexture: number,
    pencilDetail: number
): Promise<string> => {
    try {
        const promptText = createDynamicPrompt(brushStrokeBoldness, colorSaturation, paperTexture, pencilDetail);
        
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: promptText,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        // Find the image part in the response
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const newBase64 = imagePart.inlineData.data;
            const newMimeType = imagePart.inlineData.mimeType;
            return `data:${newMimeType};base64,${newBase64}`;
        } else {
            // Check for safety ratings or other reasons for no image
            const textResponse = response.text?.trim();
            if(textResponse) {
                // Throw key for translation
                throw new Error('errorApiTextResponse');
            }
             // Throw key for translation
            throw new Error('errorApiNoImage');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error && (error.message as string).startsWith('errorApi')) {
             throw error; // Re-throw our custom error keys
        }
        // Throw a generic key for other errors
        throw new Error('errorApiUnknown');
    }
};