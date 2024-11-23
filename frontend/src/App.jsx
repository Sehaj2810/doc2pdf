import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileMetadata from './components/FileMetadata';
import axios from 'axios';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file, password) => {
    const formData = new FormData();
    formData.append('document', file);
  
    if (password) {
      formData.append('password', password);
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setUploadedFile(response.data);
      setMetadata({...response.data,
        size: file.size, // Use the file's size from the original file object
        uploadDate: new Date().toISOString(), // Use current date
        fileType: file.type || 'application/docx'});
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    // Full reset for new file selection
    setFile(selectedFile);
    setMetadata(null);
    setUploadedFile(null);
    setPassword('');
    setPasswordProtected(false);
    setError(null);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setPassword('');
    setPasswordProtected(false);
    setMetadata(null);
    setUploadedFile(null);
    setError(null);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!uploadedFile) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/documents/${uploadedFile._id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${uploadedFile.originalName.replace('.docx', '.pdf')}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Reset states after successful download
      setFile(null);
      setPassword('');
      setPasswordProtected(false);
      setMetadata(null);
      setUploadedFile(null);
      setError(null);
    } catch (err) {
      setError('Download failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          DOCX to PDF Converter
        </h1>

        <FileUpload
          file={file}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onFileUpload={handleFileUpload}
          password={password}
          setPassword={setPassword}
          passwordProtected={passwordProtected}
          setPasswordProtected={setPasswordProtected}
          loading={loading}
          error={error}
          metadata = {metadata}
        />

        {metadata && (
          <div className="mt-6">
            <FileMetadata metadata={metadata} onDownload={handleDownloadPDF} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;