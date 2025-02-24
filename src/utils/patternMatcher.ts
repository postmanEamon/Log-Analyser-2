import { LogEntry } from './logParser';

export interface PatternGroup {
  pattern: string;
  count: number;
  logs: LogEntry[];
  firstOccurrence: number;
  lastOccurrence: number;
}

const generalizeMessage = (message: string): string => {
  return message
    // Replace UUIDs
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<UUID>')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '<TIMESTAMP>')
    // Replace long numbers
    .replace(/\d{8,}/g, '<NUMBER>')
    // Replace URLs while keeping the domain
    .replace(/(https?:\/\/[^\/]+)\/[^\s]*/g, '$1/<PATH>')
    // Replace hex hashes
    .replace(/[0-9a-f]{32,}/gi, '<HASH>')
    // Replace versions
    .replace(/\d+\.\d+\.\d+/g, '<VERSION>');
};

export const findPatterns = (logs: LogEntry[]): PatternGroup[] => {
  const patterns: Map<string, PatternGroup> = new Map();

  logs.forEach(log => {
    const pattern = generalizeMessage(log.message);
    
    if (!patterns.has(pattern)) {
      patterns.set(pattern, {
        pattern,
        count: 0,
        logs: [],
        firstOccurrence: log.timestamp,
        lastOccurrence: log.timestamp
      });
    }

    const group = patterns.get(pattern)!;
    group.count++;
    group.logs.push(log);
    group.firstOccurrence = Math.min(group.firstOccurrence, log.timestamp);
    group.lastOccurrence = Math.max(group.lastOccurrence, log.timestamp);
  });

  return Array.from(patterns.values())
    .sort((a, b) => b.count - a.count);
};