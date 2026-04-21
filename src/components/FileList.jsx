import { useState, useEffect } from 'react';
import { list, remove } from 'aws-amplify/storage';
import { FiFile, FiFolder, FiTrash2, FiDownload, FiMoreHorizontal } from 'react-icons/fi';
import FileDetails from './FileDetails';
import './FileList.css';

function FileList({ refreshTrigger, currentPath, onNavigate }) {
  const [items, setItems] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchFiles();
    setSelectedItem(null); // Reset selection on path change
  }, [refreshTrigger, currentPath]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const result = await list({
        options: { accessLevel: 'private' }
      });
      
      parseItems(result.items, currentPath);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseItems = (rawItems, currentPath) => {
    const folders = new Set();
    const fileGroups = {}; // { originalName: { name, latest: item, versions: [items] } }

    rawItems.forEach(item => {
      // Ignore items not in current path
      if (!item.key.startsWith(currentPath)) return;
      
      const relativeKey = item.key.substring(currentPath.length);
      if (!relativeKey) return; // Exact match to folder itself

      const slashIndex = relativeKey.indexOf('/');
      
      if (slashIndex !== -1) {
        // It's in a subfolder
        const folderName = relativeKey.substring(0, slashIndex);
        folders.add(folderName);
      } else {
        // It's a file in current directory
        if (relativeKey === '.folder') return; // Ignore dummy folder files

        // Parse version
        let originalName = relativeKey;
        const versionMatch = relativeKey.match(/(.*)__v(\d+)(\.[^.]+)$/);
        const versionMatchNoExt = relativeKey.match(/(.*)__v(\d+)$/);
        
        if (versionMatch) {
          originalName = `${versionMatch[1]}${versionMatch[3]}`;
        } else if (versionMatchNoExt) {
          originalName = versionMatchNoExt[1];
        }

        if (!fileGroups[originalName]) {
          fileGroups[originalName] = { name: originalName, latest: item, versions: [] };
        }
        
        fileGroups[originalName].versions.push(item);
        
        // Update latest if this one is newer
        if (new Date(item.lastModified) > new Date(fileGroups[originalName].latest.lastModified)) {
          fileGroups[originalName].latest = item;
        }
      }
    });

    // Sort versions inside groups
    Object.values(fileGroups).forEach(group => {
      group.versions.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    });

    setItems({
      folders: Array.from(folders).sort(),
      files: Object.values(fileGroups).sort((a, b) => a.name.localeCompare(b.name))
    });
  };

  const handleDeleteFolder = async (folderName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete folder "${folderName}" and all its contents?`)) return;
    
    const folderPrefix = `${currentPath}${folderName}/`;
    
    try {
      const result = await list({ options: { accessLevel: 'private' } });
      const itemsToDelete = result.items.filter(item => item.key.startsWith(folderPrefix));
      
      await Promise.all(itemsToDelete.map(item => 
        remove({ key: item.key, options: { accessLevel: 'private' } })
      ));
      
      fetchFiles();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="loading-state">Loading your files...</div>;
  }

  const isEmpty = items.folders.length === 0 && items.files.length === 0;

  return (
    <div className="file-list-container">
      <div className="file-list-main">
        {isEmpty ? (
          <div className="empty-state">
            <FiFile size={48} color="#c1c9d2" />
            <h3>This folder is empty</h3>
            <p>Upload a file or create a folder to get started.</p>
          </div>
        ) : (
          <div className="file-list">
            <div className="file-list-header">
              <div className="col-name">Name</div>
              <div className="col-modified">Modified</div>
              <div className="col-size">Size</div>
              <div className="col-actions"></div>
            </div>
            <div className="file-list-body">
              {/* Folders */}
              {items.folders.map(folder => (
                <div 
                  key={folder} 
                  className="file-item folder-item"
                  onClick={() => onNavigate(`${currentPath}${folder}/`)}
                >
                  <div className="col-name">
                    <FiFolder className="folder-icon" />
                    <span className="file-name">{folder}</span>
                  </div>
                  <div className="col-modified">-</div>
                  <div className="col-size">-</div>
                  <div className="col-actions">
                    <button className="action-btn delete" onClick={(e) => handleDeleteFolder(folder, e)} title="Delete Folder">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}

              {/* Files */}
              {items.files.map(fileGroup => (
                <div 
                  key={fileGroup.name} 
                  className={`file-item ${selectedItem?.name === fileGroup.name ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(fileGroup)}
                >
                  <div className="col-name">
                    <FiFile className="file-icon" />
                    <span className="file-name" title={fileGroup.name}>{fileGroup.name}</span>
                  </div>
                  <div className="col-modified">
                    {new Date(fileGroup.latest.lastModified).toLocaleDateString()}
                  </div>
                  <div className="col-size">{formatSize(fileGroup.latest.size)}</div>
                  <div className="col-actions">
                    <button className="action-btn more"><FiMoreHorizontal /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {selectedItem && (
        <FileDetails 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onRefresh={fetchFiles} 
        />
      )}
    </div>
  );
}

export default FileList;
