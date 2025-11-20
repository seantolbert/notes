'use client';

import { useEffect, useState } from 'react';

import { listLinks } from '@/lib/db/repositories/linksRepo';
import type { Link } from '@/lib/models/link';

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const data = await listLinks();
    setLinks(data);
  };

  return { links, refresh };
}
