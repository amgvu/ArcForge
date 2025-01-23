import { Server, Arc, ArcNickname } from "@/types/types";
import { supabase } from "../supabase";

export type Nickname = {
  userId: string;
  nickname: string;
  userTag: string;
};

export const fetchServers = async (accessToken: string, userId: string): Promise<Server[]> => {
  const response = await fetch('http://localhost:3000/api/servers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch servers: ${errorData.error || response.statusText}`);
  }

  return response.json();
};

export const fetchMembers = async (guildId: string) => {
  const response = await fetch(`http://localhost:3000/api/members/${guildId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  return response.json();
};

export const updateNickname = async (guildId: string, userId: string, nickname: string) => {
  const response = await fetch('http://localhost:3000/api/changeNickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
      throw new Error('Cannot change nickname of server owner or users with higher roles');
    }
    throw new Error(errorData.message || 'Failed to update nickname');
  }

  return response.json();
};

export const saveNicknames = async (guildId: string, nicknames: Nickname[]) => {
  const response = await fetch('http://localhost:3000/api/save-nicknames', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      nicknames,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save nicknames');
  }

  return response.json();
};

export const createArc = async (guildId: string, arcName: string): Promise<Arc> => {
  const { data, error } = await supabase
    .from('arcs')
    .insert([{ guild_id: guildId, arc_name: arcName }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const saveArcNicknames = async (arcNicknames: ArcNickname[]): Promise<void> => {
  const { error } = await supabase
    .from('arc_nicknames')
    .insert(arcNicknames);

  if (error) {
    throw new Error(error.message);
  }
};

export const checkExistingArc = async (guildId: string, arcName: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('arcs')
    .select('id')
    .eq('guild_id', guildId)
    .eq('arc_name', arcName)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return !!data;
};