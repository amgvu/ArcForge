import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchServers } from "@/lib/utilities/api";
import { Server } from "@/types/types";

export const useServers = () => {
  const { data: session } = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getServers = async () => {
      if (session?.accessToken && session.user?.id) {
        try {
          const data = await fetchServers(session.accessToken, session.user.id);
          setServers(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch servers"
          );
        }
      }
    };

    if (session) {
      const timeoutId = setTimeout(() => {
        getServers();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  return { servers, error };
};
