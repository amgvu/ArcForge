import { useEffect, useState } from "react";
import { fetchMembers } from "../utilities/api";
import { Member } from "@/types/types";

export const useMembers = (guildId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const data = await fetchMembers(guildId);
        setMembers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch members');
      }
    };

    if (guildId) {
      getMembers();
    }
  }, [guildId]);

  return { members, error };
};