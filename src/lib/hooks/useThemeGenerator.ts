/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Member } from "@/types/types";
import { characterGen } from "@/lib/utilities/gemini/characters";

export const useThemeGenerator = (
  members: Member[],
  setMembers: (members: Member[]) => void
) => {
  const [theme, setTheme] = useState<string>("");
  const [generatedThemes, setGeneratedThemes] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateCharacters = async () => {
    if (!members || members.length === 0) {
      alert("No members found in the server. Please select a valid server.");
      return;
    }

    if (!theme.trim()) {
      alert("Please enter a theme.");
      return;
    }

    setLoading(true);
    try {
      const numCharacters = members.length;
      const characters = await characterGen(theme, numCharacters);
      setGeneratedThemes(characters);

      const generatedNames = characters.split(",").map((name) => name.trim());

      const updatedMembers = members.map((member: Member, index: number) => ({
        ...member,
        nickname: generatedNames[index] || member.nickname,
      }));

      setMembers(updatedMembers);
    } catch (error) {
      console.error("Failed to generate themes:", error);
      alert("Failed to generate themes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    theme,
    setTheme,
    loading,
    handleGenerateCharacters,
  };
};
