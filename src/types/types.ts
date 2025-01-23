export interface Server {
  id: string;
  name: string;
}

export interface Member {
  user_id: string;
  username: string;
  nickname: string;
  tag: string;
  avatar_url: string;
}

export interface Arc {
  id?: number;
  name: string;
  guild_id: string;
}

export interface ArcNickname {
  arc_id: number;
  user_id: string;
  nickname: string;
  userTag: string;
}

export interface Nickname {
  userId: string;
  nickname: string;
  userTag: string;
}