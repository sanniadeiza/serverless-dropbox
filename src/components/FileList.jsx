import { useState, useEffect } from 'react';
import { list, getUrl, remove } from 'aws-amplify/storage';
import { FiFile, FiDownload, FiTrash2, FiClock } from 'react-icons/fi';
import './FileList.css';

function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const result = await list({
        options: {
          accessLevel: 'private'
        }
      });
      setFiles(result.items);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (key) => {
    try {
      const { url } = await getUrl({
        key,
        options: {
          accessLevel: 'private',
          expiresIn: 60
        }
      });
      window.open(url.toString(), '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Are you sure you want to delete ${key}?`)) return;
    
    try {
      await remove({
        key,
        options: {
          accessLevel: 'private'
        }
      });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="loading-state">Loading your files...</div>;
  }

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <FiFile size={48} color="#c1c9d2" />
        <h3>No files uploaded yet</h3>
        <p>Upload a file to get started with ServerlessBox.</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <div className="col-name">Name</div>
        <div className="col-modified">Last Modified</div>
        <div className="col-size">Size</div>
        <div className="col-actions">Actions</div>
      </div>
      <div className="file-list-body">
        {files.map((file) => (
          <div key={file.key} className="file-item">
            <div className="col-name">
              <FiFile className="file-icon" />
              <span className="file-name" title={file.key}>{file.key}</span>
            </div>
            <div className="col-modified">
              <span className="date">{new Date(file.lastModified).toLocaleDateString()}</span>
              <span className="time">{new Date(file.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="col-size">{formatSize(file.size)}</div>
            <div className="col-actions">
              <button onClick={() => handleDownload(file.key)} className="action-btn download" title="Download">
                <FiDownload />
              </button>
              <button onClick={() => handleDelete(file.key)} className="action-btn delete" title="Delete">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;
