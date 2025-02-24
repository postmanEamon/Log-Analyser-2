export interface LogEntry {
  pid: string;
  timestamp: number;
  context: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface LogStats {
  info: number;
  warn: number;
  error: number;
  total: number;
  filtered: number;
}

export interface LogFile {
  id: string;
  name: string;
  logs: LogEntry[];
}

export const parseLogLine = (line: string): LogEntry | null => {
  if (!line.trim()) return null;

  const parts = line.match(/\[(.*?)\]/g);
  if (!parts || parts.length !== 5) return null;

  const [pid, timestamp, context, level, message] = parts.map(p => 
    p.slice(1, -1).replace(/^"|"$/g, '')
  );

  return {
    pid,
    timestamp: parseInt(timestamp),
    context,
    level: level.toLowerCase() as LogEntry['level'],
    message
  };
};

export const calculateLogStats = (allLogs: LogEntry[], filteredLogs: LogEntry[]): LogStats => {
  return {
    info: allLogs.filter(log => log.level === 'info').length,
    warn: allLogs.filter(log => log.level === 'warn').length,
    error: allLogs.filter(log => log.level === 'error').length,
    total: allLogs.length,
    filtered: filteredLogs.length
  };
};