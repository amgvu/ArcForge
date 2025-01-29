export interface Server {
  id: string;
  name: string;
}

export interface Member {
  user_id: string;
  username: string;
  nickname: string;
  globalName: string;
  userTag: string;
  avatar_url: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  position: number;
  color?: string;
}

export interface Arc {
  id: number;
  name: string;
  guild_id: string;
  arc_name: string;
}

export interface ArcNickname {
  arc_id: number;
  guild_id: string;
  user_id: string;
  nickname: string;
  userTag: string;
}

export interface Nickname {
  userId: string;
  nickname: string;
  userTag: string;
}