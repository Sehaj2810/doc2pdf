import React, { useRef, useState } from 'react';

const FileUpload = ({
  onFileUpload,
  loading,
  error,
  file,
  onFileChange,
  onRemoveFile,
  metadata
}) => {
  const [password, setPassword] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const fileInputRef = useRef(null);

  // Handles the password protection checkbox change
  const handlePasswordCheckbox = () => {
    setPasswordProtected(!passwordProtected);
    if (!passwordProtected) {
      setPassword(''); // Clear password if unchecked
    }
  };

  // Handle file upload and reset states
  const handleUpload = () => {
    if (file) {
      onFileUpload(file, passwordProtected ? password : null);
    }
  };

  // Custom remove file handler
  const handleRemoveFile = () => {
    onRemoveFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
      >
        <input 
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={onFileChange}
          className="hidden"
        />
        <button
          className="w-full text-sm text-gray-600"
          onClick={() => fileInputRef.current.click()}
        >
          Choose File or Drag & Drop
        </button>
        <p className="text-sm text-gray-500 mt-2">Only .docx files are supported (max 10MB)</p>
      </div>

      {/* File Preview */}
      {file && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Selected File: {file.name}</h3>
          <p className="text-sm text-gray-600">{file.size} bytes</p>
          <button
            className="mt-2 text-red-600"
            onClick={handleRemoveFile}
          >
            Remove file
          </button>
        </div>
      )}

      {/* Password Protection Checkbox */}
      {file && (
        <div className="mt-4">
          <label className={`inline-flex items-center ${metadata ? 'text-gray-400' : ''}`}>
            <input 
              type="checkbox" 
              checked={passwordProtected} 
              onChange={handlePasswordCheckbox} 
              className={`form-checkbox ${metadata ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={metadata}
            />
            <span className="ml-2">Add password protection</span>
          </label>
        </div>
      )}

      {/* Password Input */}
      {file && passwordProtected && !metadata && (
        <div className="mt-4">
          <input
            type="password"
            placeholder="Enter password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
          />
        </div>
      )}

      {/* Upload Button */}
      {file && !loading && !metadata && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload File
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-blue-600 mt-4">
          <svg
            className="animate-spin mx-auto h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2">Uploading...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};


export default FileUpload;