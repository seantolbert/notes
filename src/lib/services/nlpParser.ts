export interface ParsedCommand {
  intent: 'create_task' | 'create_note' | 'create_event' | 'unknown';
  payload: Record<string, unknown>;
}

export function parseNaturalInput(input: string): ParsedCommand {
  // TODO: implement intent detection and entity extraction.
  return {
    intent: 'unknown',
    payload: { raw: input }
  };
}
