import type { Tag } from '@/lib/models/tag';

// TODO: persist tags and calculate usage counts.
export async function listTags(): Promise<Tag[]> {
  return [];
}

export async function saveTag(tag: Tag): Promise<void> {
  void tag;
}

export async function deleteTag(id: string): Promise<void> {
  void id;
}
