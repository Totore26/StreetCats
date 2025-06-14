export interface CatSightingItem {
  id?: number; 
  title: string;
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  createdAt?: Date; 
  updatedAt?: Date;
  UserUsername?: string;
  Comments?: CommentItem[];
}

export interface CommentItem {
  id?: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  CatSightingId?: number;
  UserUsername?: string; 
}

export interface AuthRequest { usr: string, pwd: string }