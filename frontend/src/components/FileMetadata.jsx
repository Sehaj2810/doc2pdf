import React from 'react';
import { formatBytes, formatDate } from '../utils/formatters';

const FileMetadata = ({ metadata, onDownload }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">File Metadata</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Original Name:</p>
          <p className="font-medium">{metadata.originalName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">File Size:</p>
          <p className="font-medium">{formatBytes(metadata.size)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Upload Date:</p>
          <p className="font-medium">{formatDate(metadata.uploadDate)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">File Type:</p>
          <p className="font-medium">{metadata.fileType}</p>
        </div>
      </div>
      
      <button
        onClick={onDownload}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg 
        hover:bg-blue-700 transition-colors duration-300 
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download PDF
      </button>
    </div>
  );
};

export default FileMetadata;