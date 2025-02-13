import { Server, Arc, ArcNickname, Nickname } from "@/types/types";
import { supabase } from "../supabase";

export const fetchServers = async (
  accessToken: string,
  userId: string
): Promise<Server[]> => {
  const response = await fetch("http://localhost:3000/api/servers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to fetch servers: ${errorData.error || response.statusText}`
    );
  }

  return response.json();
};

export const fetchMembers = async (guildId: string) => {
  const response = await fetch(`http://localhost:3000/api/members/${guildId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch members");
  }
  return response.json();
};

///////////////////////CRUD OPERATIONS FOR NICKNAMES///////////////////////

export const updateNickname = async (
  guildId: string,
  userId: string,
  nickname: string
) => {
  const response = await fetch("http://localhost:3000/api/changeNickname", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guild_id: guildId,
      user_id: userId,
      nickname,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 403 && errorData.code === 50013) {
      throw new Error(
        "Cannot change nickname of server owner or users with higher roles"
      );
    }
    throw new Error(errorData.message || "Failed to update nickname");
  }

  return response.json();
};

export const fetchNicknames = async (
  guild_id: string,
  userId: string
): Promise<Nickname[]> => {
  try {
    const { data, error } = await supabase
      .from("nicknames")
      .select("*")
      .eq("guild_id", guild_id)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch nicknames: ${error.message}`);
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error in fetchNicknames:", err);
    throw err;
  }
};

export const saveNicknames = async (
  guildId: string,
  nicknames: Nickname[]
): Promise<{
  message: string;
  savedNicknames: Array<{
    guild_id: string;
    user_id: string;
    user_tag: string;
    nickname: string;
    updated_at: string;
    is_active: boolean;
  }>;
}> => {
  const validNicknames: {
    guild_id: string;
    user_id: string;
    user_tag: string;
    nickname: string;
    updated_at: string;
    is_active: boolean;
  }[] = nicknames.map((n) => ({
    guild_id: guildId,
    user_id: n.userId,
    user_tag: n.userTag || "",
    nickname: n.nickname.trim(),
    updated_at: new Date().toISOString(),
    is_active: true,
  }));

  const upsertResults = await Promise.all(
    validNicknames.map(async (nickname) => {
      const { data: existingNicknames, error: fetchError } = await supabase
        .from("nicknames")
        .select("*")
        .eq("guild_id", nickname.guild_id)
        .eq("user_id", nickname.user_id)
        .eq("nickname", nickname.nickname)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing nickname:", fetchError);
        return null;
      }

      if (existingNicknames) {
        return existingNicknames;
      }

      await supabase
        .from("nicknames")
        .update({ is_active: false })
        .eq("guild_id", nickname.guild_id)
        .eq("user_id", nickname.user_id)
        .eq("is_active", true);

      const { data, error } = await supabase
        .from("nicknames")
        .insert(nickname)
        .select();

      if (error) {
        console.error("Error saving nickname:", error);
        return null;
      }

      return data[0];
    })
  );

  const savedNicknames = upsertResults.filter((result) => result !== null);

  if (savedNicknames.length === 0) {
    throw new Error("Failed to save any nicknames.");
  }

  return {
    message: "Nicknames processed successfully.",
    savedNicknames: savedNicknames,
  };
};

export const deleteNickname = async (
  guildId: string,
  userId: string,
  nickname: string
): Promise<void> => {
  const { error } = await supabase
    .from("nicknames")
    .delete()
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .eq("nickname", nickname);

  if (error) {
    throw new Error(`Failed to delete nickname: ${error.message}`);
  }
};

///////////////////////CRUD OPERATIONS FOR ARCS///////////////////////

export const createArc = async (
  guildId: string,
  arcName: string
): Promise<Arc> => {
  const { data, error } = await supabase
    .from("arcs")
    .insert([{ guild_id: guildId, arc_name: arcName }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteArc = async (arcId: number): Promise<void> => {
  const { data: arcNicknames, error: fetchError } = await supabase
    .from("arc_nicknames")
    .select("guild_id, user_id, nickname")
    .eq("arc_id", arcId);

  if (fetchError) {
    throw new Error(`Failed to fetch arc nicknames: ${fetchError.message}`);
  }

  if (arcNicknames && arcNicknames.length > 0) {
    for (const nickname of arcNicknames) {
      const { error: deleteNicknameError } = await supabase
        .from("nicknames")
        .delete()
        .eq("guild_id", nickname.guild_id)
        .eq("user_id", nickname.user_id)
        .eq("nickname", nickname.nickname);

      if (deleteNicknameError) {
        throw new Error(
          `Failed to delete nickname: ${deleteNicknameError.message}`
        );
      }
    }
  }

  const { error: deleteArcNicknamesError } = await supabase
    .from("arc_nicknames")
    .delete()
    .eq("arc_id", arcId);

  if (deleteArcNicknamesError) {
    throw new Error(
      `Failed to delete arc nicknames: ${deleteArcNicknamesError.message}`
    );
  }

  const { error: deleteArcError } = await supabase
    .from("arcs")
    .delete()
    .eq("id", arcId);

  if (deleteArcError) {
    throw new Error(`Failed to delete arc: ${deleteArcError.message}`);
  }
};

export const fetchArcs = async (guild_id: string): Promise<Arc[]> => {
  const { data, error } = await supabase
    .from("arcs")
    .select("*")
    .eq("guild_id", guild_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const saveArcNicknames = async (
  arcNicknames: ArcNickname[]
): Promise<void> => {
  const { error } = await supabase.from("arc_nicknames").insert(
    arcNicknames.map((nickname) => ({
      arc_id: nickname.arc_id,
      guild_id: nickname.guild_id,
      user_id: nickname.user_id,
      nickname: nickname.nickname,
      user_tag: nickname.userTag,
    }))
  );

  if (error) {
    throw new Error(error.message);
  }
};

export const checkExistingArc = async (
  guildId: string,
  arcName: string
): Promise<Arc | null> => {
  const { data, error } = await supabase
    .from("arcs")
    .select("*")
    .eq("guild_id", guildId)
    .eq("arc_name", arcName)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
};

export const fetchArcNicknames = async (
  arcId: number
): Promise<ArcNickname[]> => {
  const { data, error } = await supabase
    .from("arc_nicknames")
    .select("*")
    .eq("arc_id", arcId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteArcNicknames = async (arcId: number): Promise<void> => {
  const { error } = await supabase
    .from("arc_nicknames")
    .delete()
    .eq("arc_id", arcId);

  if (error) {
    throw new Error(error.message);
  }
};

const compareNicknames = (
  nicknames1: ArcNickname[],
  nicknames2: ArcNickname[]
): boolean => {
  if (nicknames1.length !== nicknames2.length) {
    return false;
  }

  const sorted1 = nicknames1.sort((a, b) => a.user_id.localeCompare(b.user_id));
  const sorted2 = nicknames2.sort((a, b) => a.user_id.localeCompare(b.user_id));

  for (let i = 0; i < sorted1.length; i++) {
    if (
      sorted1[i].user_id !== sorted2[i].user_id ||
      sorted1[i].nickname !== sorted2[i].nickname
    ) {
      return false;
    }
  }

  return true;
};

export const checkDuplicateArcNicknames = async (
  guildId: string,
  newNicknames: ArcNickname[]
): Promise<boolean> => {
  const { data: arcs, error: arcsError } = await supabase
    .from("arcs")
    .select("id")
    .eq("guild_id", guildId);

  if (arcsError) {
    throw new Error(arcsError.message);
  }

  for (const arc of arcs) {
    const existingNicknames = await fetchArcNicknames(arc.id);

    if (compareNicknames(newNicknames, existingNicknames)) {
      return true;
    }
  }

  return false;
};
