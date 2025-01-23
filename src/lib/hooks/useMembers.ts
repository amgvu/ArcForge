import { useEffect, useState } from "react";
import { fetchMembers } from "../utils/api";

export type Member = {
  user_id: string;
  username: string;
  nickname: string;
  tag: string;
  avatar_url: string;
};

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