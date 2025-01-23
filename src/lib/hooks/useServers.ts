import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchServers } from "@/lib/utils/api";
import { Server } from "@/types/types";

export const useServers = () => {
  const { data: session } = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getServers = async () => {
      if (session?.accessToken && session.user?.id) {
        try {
          const cachedServers = localStorage.getItem('cachedServers');
          if (cachedServers) {
            setServers(JSON.parse(cachedServers));
            return;
          }

          const data = await fetchServers(session.accessToken, session.user.id);
          setServers(data);
          localStorage.setItem('cachedServers', JSON.stringify(data));
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch servers');
        }
      }
    };

    getServers();
  }, [session]);

  return { servers, error };
};