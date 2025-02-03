// Add these new types
export interface Collection {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  stats?: {
    scans_count: number;
    views_count: number;
    likes_count: number;
    activations_count: number;
  };
}

export interface Activation {
  id: string;
  user_id: string;
  title: string;
  description: string;
  color: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  stats?: {
    scans_count: number;
    views_count: number;
    likes_count: number;
  };
}