import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
    }
  }, [status]);

  return { session, status };
};
