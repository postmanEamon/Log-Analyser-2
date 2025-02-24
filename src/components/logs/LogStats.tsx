import { LogStats as LogStatsType } from '@/utils/logParser';

interface LogStatsProps {
  stats: LogStatsType;
}

export const LogStats = ({ stats }: LogStatsProps) => {
  return (
    <div className="text-sm text-gray-600 space-y-1">
      <div>Showing {stats.filtered} of {stats.total} logs</div>
      <div className="text-xs space-x-3">
        <span className="text-blue-600">Info: {stats.info}</span>
        <span className="text-yellow-600">Warn: {stats.warn}</span>
        <span className="text-red-600">Error: {stats.error}</span>
      </div>
    </div>
  );
};