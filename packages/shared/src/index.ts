export type EntryType = "DIARY" | "NOTE" | "ARTICLE";

export interface PublicEntry {
  id: string;
  title: string;
  content: string;
  type: EntryType;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
