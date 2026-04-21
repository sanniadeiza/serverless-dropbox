import { useState, useRef } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { FiUploadCloud } from 'react-icons/fi';
import './FileUpload.css';

function FileUpload({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const uploadTask = uploadData({
        key: file.name,
        data: file,
        options: {
          accessLevel: 'private',
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              setProgress(Math.round((transferredBytes / totalBytes) * 100));
            }
          }
        }
      });
      
      await uploadTask.result;
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" className={`upload-button ${isUploading ? 'uploading' : ''}`}>
        <FiUploadCloud size={20} />
        <span>{isUploading ? `Uploading... ${progress}%` : 'Upload File'}</span>
        {isUploading && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </label>
    </div>
  );
}

export default FileUpload;
