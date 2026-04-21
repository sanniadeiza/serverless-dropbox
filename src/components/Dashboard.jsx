import { useState } from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';
import './Dashboard.css';

function Dashboard({ user }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Files</h2>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </div>
      
      <div className="dashboard-content">
        <FileList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default Dashboard;
