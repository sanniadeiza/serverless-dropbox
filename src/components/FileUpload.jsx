import { useState, useRef } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { FiUploadCloud } from 'react-icons/fi';
import './FileUpload.css';

function FileUpload({ onUploadComplete, currentPath }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Create versioned key: filename__v123456789.ext
      const lastDotIndex = file.name.lastIndexOf('.');
      let nameWithoutExt = file.name;
      let ext = '';
      if (lastDotIndex !== -1) {
        nameWithoutExt = file.name.substring(0, lastDotIndex);
        ext = file.name.substring(lastDotIndex);
      }
      
      const timestamp = Date.now();
      const versionedName = `${nameWithoutExt}__v${timestamp}${ext}`;
      const uploadKey = `${currentPath}${versionedName}`;

      const uploadTask = uploadData({
        key: uploadKey,
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
      <label htmlFor="file-upload-input" className={`btn-primary upload-button ${isUploading ? 'uploading' : ''}`}>
        <FiUploadCloud size={18} />
        <span>{isUploading ? `Uploading... ${progress}%` : 'Upload'}</span>
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
