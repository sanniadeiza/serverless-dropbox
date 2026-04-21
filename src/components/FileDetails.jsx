import { useState, useEffect } from 'react';
import { getUrl, remove } from 'aws-amplify/storage';
import { FiX, FiDownload, FiTrash2, FiShare2, FiClock, FiFile } from 'react-icons/fi';
import './FileDetails.css';

function FileDetails({ item, onClose, onRefresh }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [shareExpiration, setShareExpiration] = useState(3600); // 1 hour
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  // item is a grouped file object: { name, latest: fileItem, versions: [fileItem1, fileItem2] }

  useEffect(() => {
    if (item && isPreviewable(item.name)) {
      generatePreview(item.latest.key);
    } else {
      setPreviewUrl(null);
    }
    setShareLink('');
  }, [item]);

  const isPreviewable = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'pdf', 'txt', 'csv'].includes(ext);
  };

  const isImage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
  };

  const generatePreview = async (key) => {
    try {
      const { url } = await getUrl({
        key,
        options: {
          accessLevel: 'private',
          expiresIn: 3600
        }
      });
      setPreviewUrl(url.toString());
    } catch (error) {
      console.error('Error generating preview', error);
      setPreviewUrl(null);
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

  const handleDeleteVersion = async (key) => {
    if (!window.confirm('Delete this version?')) return;
    try {
      await remove({ key, options: { accessLevel: 'private' }});
      onRefresh();
    } catch (error) {
      console.error('Error deleting', error);
    }
  };

  const handleGenerateShare = async () => {
    setIsGeneratingShare(true);
    try {
      const { url } = await getUrl({
        key: item.latest.key,
        options: {
          accessLevel: 'private', // Normally you'd want guest, but for this simple app private works with signed URL
          expiresIn: shareExpiration
        }
      });
      setShareLink(url.toString());
    } catch (error) {
      console.error('Error sharing', error);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!item) return null;

  return (
    <div className="file-details">
      <div className="details-header">
        <h3 title={item.name}>{item.name}</h3>
        <button className="close-btn" onClick={onClose}><FiX /></button>
      </div>

      <div className="preview-container">
        {previewUrl ? (
          isImage(item.name) ? (
            <img src={previewUrl} alt={item.name} className="image-preview" />
          ) : (
            <iframe src={previewUrl} className="iframe-preview" title="preview" />
          )
        ) : (
          <div className="no-preview">
            <FiFile size={48} color="#c1c9d2" />
            <p>No preview available</p>
          </div>
        )}
      </div>

      <div className="details-actions">
        <button className="btn-secondary" onClick={() => handleDownload(item.latest.key)}>
          <FiDownload /> Download
        </button>
      </div>

      <div className="details-section">
        <h4>Sharing</h4>
        <div className="share-controls">
          <select 
            value={shareExpiration} 
            onChange={(e) => setShareExpiration(Number(e.target.value))}
            className="expire-select"
          >
            <option value={3600}>1 Hour</option>
            <option value={86400}>1 Day</option>
            <option value={604800}>1 Week</option>
          </select>
          <button className="btn-secondary share-btn" onClick={handleGenerateShare} disabled={isGeneratingShare}>
            <FiShare2 /> {isGeneratingShare ? '...' : 'Share'}
          </button>
        </div>
        {shareLink && (
          <div className="share-link-box">
            <input type="text" readOnly value={shareLink} />
            <button onClick={copyShareLink}>Copy</button>
          </div>
        )}
      </div>

      <div className="details-section">
        <h4>Version History ({item.versions.length})</h4>
        <div className="version-list">
          {item.versions.map((ver, idx) => (
            <div key={ver.key} className="version-item">
              <div className="version-info">
                <span className="version-date">
                  {new Date(ver.lastModified).toLocaleString()}
                </span>
                <span className="version-size">{formatSize(ver.size)}</span>
              </div>
              <div className="version-actions">
                <button onClick={() => handleDownload(ver.key)} title="Download"><FiDownload /></button>
                <button onClick={() => handleDeleteVersion(ver.key)} title="Delete"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileDetails;
