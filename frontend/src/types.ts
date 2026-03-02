export interface User { 
  id: number; 
  name: string; 
  email: string; 
}

export interface Project { 
  id: number; 
  name: string; 
  inviteCode: string; 
}

export interface Post { 
  id: number; 
  title: string; 
  content: string; 
  imageUrl?: string; 
  researchLink?: string; 
  isPublic: boolean; 
  postType: string; 
  createdAt: string; 
  author: { name: string }; 
  project?: { name: string }; 
  projectId: number;
}