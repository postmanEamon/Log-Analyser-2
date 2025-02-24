import { LogFile } from '@/utils/logParser';
import { FileText } from 'lucide-react';

interface FileSelectorProps {
  files: LogFile[];
  selectedFileId: string | null;
  onFileSelect: (fileId: string) => void;
}

export const FileSelector = ({
  files,
  selectedFileId,
  onFileSelect
}: FileSelectorProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onFileSelect(file.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            selectedFileId === file.id
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="truncate max-w-xs">{file.name}</span>
          <span className="text-xs opacity-75">({file.logs.length} logs)</span>
        </button>
      ))}
    </div>
  );
};