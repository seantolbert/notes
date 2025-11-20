export interface Note {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  links?: string[];
  createdAt: string;
  updatedAt: string;
}

// TODO: expand with notebook references, pinning, and rich text metadata.
