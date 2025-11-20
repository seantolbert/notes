import type { Link } from '@/lib/models/link';

// TODO: persist relationships for backlink graph and link previews.
export async function listLinks(): Promise<Link[]> {
  return [];
}

export async function saveLink(link: Link): Promise<void> {
  void link;
}

export async function deleteLink(id: string): Promise<void> {
  void id;
}
