import { useState } from "react";
import { Member } from "@/types/types";
import { characterGen } from "@/lib/utilities/gemini/characters";

export const useThemeGenerator = (
  members: Member[],
  setMembers: (members: Member[]) => void
) => {
  const [theme, setTheme] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generatedThemes, setGeneratedThemes] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSortedMembers = (membersList: Member[]): Member[] => {
    const groupedMembers = membersList.reduce(
      (acc: Record<string, Member[]>, member) => {
        const highestRole = member.roles[0]?.name || "No Role";
        if (!acc[highestRole]) {
          acc[highestRole] = [];
        }
        acc[highestRole].push(member);
        return acc;
      },
      {}
    );

    const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
      const roleAPosition =
        membersList.find((m) => m.roles[0]?.name === a)?.roles[0]?.position ??
        -1;
      const roleBPosition =
        membersList.find((m) => m.roles[0]?.name === b)?.roles[0]?.position ??
        -1;
      return roleBPosition - roleAPosition;
    });

    return sortedRoles.flatMap((roleName) => groupedMembers[roleName]);
  };

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

      const sortedMembers = getSortedMembers(members);

      const nicknameMapping: { [key: string]: string } = {};
      sortedMembers.forEach((member, index) => {
        nicknameMapping[member.user_id] =
          generatedNames[index] || member.nickname;
      });

      const updatedMembers = members.map((member) => ({
        ...member,
        nickname: nicknameMapping[member.user_id],
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
