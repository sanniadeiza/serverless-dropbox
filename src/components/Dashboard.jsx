import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { FiFolderPlus, FiUploadCloud, FiChevronRight, FiHome } from 'react-icons/fi';
import FileUpload from './FileUpload';
import FileList from './FileList';
import './Dashboard.css';

function Dashboard({ user }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPath, setCurrentPath] = useState(''); // '' means root, 'folder/' means inside folder
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    setIsCreating(true);
    try {
      // Create a dummy file to simulate a folder
      const folderKey = `${currentPath}${newFolderName}/.folder`;
      const dummyContent = new Blob([''], { type: 'text/plain' });
      
      await uploadData({
        key: folderKey,
        data: dummyContent,
        options: {
          accessLevel: 'private'
        }
      }).result;
      
      setNewFolderName('');
      setIsCreatingFolder(false);
      handleUploadComplete();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  // Build breadcrumbs
  const pathParts = currentPath.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', path: '' },
    ...pathParts.map((part, index) => {
      const path = pathParts.slice(0, index + 1).join('/') + '/';
      return { name: part, path };
    })
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-topbar">
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="breadcrumb-item">
              {index === 0 ? <FiHome className="home-icon" /> : null}
              <span 
                className="breadcrumb-link"
                onClick={() => setCurrentPath(crumb.path)}
              >
                {crumb.name}
              </span>
              {index < breadcrumbs.length - 1 && <FiChevronRight className="chevron" />}
            </div>
          ))}
        </div>
        
        <div className="dashboard-actions">
          {isCreatingFolder ? (
            <form onSubmit={handleCreateFolder} className="create-folder-form">
              <input 
                type="text" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                autoFocus
                disabled={isCreating}
              />
              <button type="submit" className="btn-primary" disabled={isCreating}>Create</button>
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingFolder(false)} disabled={isCreating}>Cancel</button>
            </form>
          ) : (
            <button className="btn-secondary create-folder-btn" onClick={() => setIsCreatingFolder(true)}>
              <FiFolderPlus /> New Folder
            </button>
          )}
          <FileUpload onUploadComplete={handleUploadComplete} currentPath={currentPath} />
        </div>
      </div>
      
      <div className="dashboard-content">
        <FileList 
          refreshTrigger={refreshTrigger} 
          currentPath={currentPath} 
          onNavigate={(path) => setCurrentPath(path)} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
