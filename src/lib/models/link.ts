export type LinkType = 'note' | 'task' | 'event' | 'tag';

export interface Link {
  id: string;
  sourceId: string;
  sourceType: LinkType;
  targetId: string;
  targetType: LinkType;
  createdAt: string;
}

// TODO: add directionality metadata and backlink helpers.
