import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const GenerativeThemes = async (theme: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI("AIzaSyCrQaLyB3iYHn-50Z-1wPu2qVUEvnPjDRI");

  const schema = {
    description: `List of popular characters or objects related to a given theme.`,
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          description: "Name of the character or object",
          nullable: false,
        },
      },
      required: ["name"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `List 20 popular characters given the theme, ${theme}, ordered from most to least popular. Please omit any explanations, disclaimers, or unnecessary text.`;

  try {
    const result = await model.generateContent(prompt);

    const response = JSON.parse(result.response.text());

    const names = response.map((item: { name: string }) => item.name);
    return names.join(", ");
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};



