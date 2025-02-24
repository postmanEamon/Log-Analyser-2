'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Filter, List, Hash } from 'lucide-react';
import { findPatterns } from '../utils/patternMatcher';
import { PatternView } from './logs/PatternView';
import { LogEntry as LogEntryType, LogFile, parseLogLine, calculateLogStats } from '../utils/logParser';
import { LogEntry } from './logs/LogEntry';
import { LogFilters } from './logs/LogFilters';
import { LogStats } from './logs/LogStats';
import { FileSelector } from './logs/FileSelector';

const LogAnalyzer = () => {
  const [files, setFiles] = useState<LogFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'logs' | 'patterns'>('logs');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    try {
      const newFiles: LogFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const text = await file.text();
        const lines = text.split('\n');
        
        const parsedLogs = lines
          .map((line, index) => {
            const log = parseLogLine(line);
            if (!log) {
              console.warn(`Failed to parse line ${index} in ${file.name}:`, line);
            }
            return log;
          })
          .filter((log): log is LogEntryType => log !== null);
        
        newFiles.push({
          id: crypto.randomUUID(),
          name: file.name,
          logs: parsedLogs
        });
      }

      setFiles(prev => [...prev, ...newFiles]);
      if (!selectedFileId && newFiles.length > 0) {
        setSelectedFileId(newFiles[0].id);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const selectedFile = files.find(f => f.id === selectedFileId);
  const currentLogs = selectedFile?.logs || [];

  const filteredAndSortedLogs = currentLogs
    .filter(log => {
      const levelMatch = filter === 'all' || log.level === filter;
      const searchMatch = !searchTerm || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context.toLowerCase().includes(searchTerm.toLowerCase());
      return levelMatch && searchMatch;
    })
    .sort((a, b) => {
      const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
      return (a.timestamp - b.timestamp) * sortMultiplier;
    });

  const stats = calculateLogStats(currentLogs, filteredAndSortedLogs);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-6 h-6" />
            Log Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* File Upload */}
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileUpload}
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {files.length > 0 && (
            <>
              <FileSelector
                files={files}
                selectedFileId={selectedFileId}
                onFileSelect={setSelectedFileId}
              />

              <LogFilters
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
              
              <div className="mb-4 flex justify-between items-center">
                <LogStats stats={stats} />
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('logs')}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      viewMode === 'logs' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" /> Log View
                  </button>
                  <button
                    onClick={() => setViewMode('patterns')}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      viewMode === 'patterns' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <Hash className="w-4 h-4" /> Pattern View
                  </button>
                </div>
              </div>

              <LogStats stats={stats} />

              {viewMode === 'logs' ? (
                <div className="space-y-2 mt-4">
                  {filteredAndSortedLogs.map((log, index) => (
                    <LogEntry key={index} log={log} />
                  ))}
                </div>
              ) : (
                <PatternView patterns={findPatterns(filteredAndSortedLogs)} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogAnalyzer;