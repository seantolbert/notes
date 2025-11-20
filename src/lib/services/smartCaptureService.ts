import { createId } from '@/lib/utils/ids';

export interface CaptureResult {
  id: string;
  title: string;
  type: 'note' | 'task' | 'event' | 'unknown';
  createdAt: string;
}

export async function captureInput(raw: string): Promise<CaptureResult> {
  // TODO: route capture to the correct repo based on NLP parsing.
  return {
    id: createId('capture'),
    title: raw,
    type: 'unknown',
    createdAt: new Date().toISOString()
  };
}
