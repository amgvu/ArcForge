import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const characterGen = async (
  theme: string,
  numMembers: number
): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

  const schema = {
    description: `List of popular characters related to a given theme from most to least popular.`,
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          description: "Name of the character",
          nullable: false,
        },
      },
      required: ["name"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `List ${numMembers} popular characters related to the theme "${theme}",
   ordered from most to least popular.  For the purposes of this list, "popularity" should
    be determined by a combination of factors, including frequency of online mentions, fan
     sentiment (positive or negative), critical acclaim, and relevance to the core themes of
      "${theme}".  Return ONLY a JSON array of character names, with no other text or explanations.
        The JSON array should be formatted as follows: ["Character 1", "Character 2", "Character 3", ...].
          Character 1 should be the most popular, Character 2 the second most, and so on.  If fewer than
           ${numMembers} relevant characters exist, return all that you can find. Please omit any explanations,
            disclaimers, or unnecessary text.`;

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
