'use client';

import { useEffect, useState } from 'react';

import { listTags } from '@/lib/db/repositories/tagsRepo';
import type { Tag } from '@/lib/models/tag';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const data = await listTags();
    setTags(data);
  };

  return { tags, refresh };
}
