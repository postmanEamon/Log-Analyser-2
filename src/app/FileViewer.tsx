import React from "react";
import { FixedSizeList as List } from "react-window";

interface FileViewerProps {
  fileContent: string;
  height?: number; // Optional: height of the viewer in px
  width?: number;  // Optional: width of the viewer in px
  lineHeight?: number; // Optional: height of each line in px
}

const FileViewer: React.FC<FileViewerProps> = ({
  fileContent,
  height = 600,
  width = "100%",
  lineHeight = 20,
}) => {
  const lines = React.useMemo(() => fileContent.split("\n"), [fileContent]);

  return (
    <List
      height={height}
      itemCount={lines.length}
      itemSize={lineHeight}
      width={width}
      style={{ fontFamily: "monospace", background: "var(--background)" }}
    >
      {({ index, style }) => (
        <div style={style} className="whitespace-pre-wrap">
          {lines[index]}
        </div>
      )}
    </List>
  );
};

export default FileViewer;