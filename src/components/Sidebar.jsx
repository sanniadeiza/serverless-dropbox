import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

function Sidebar({ currentView, setCurrentView, signOut, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => setCurrentView('files')}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#0061FF"/>
          <path d="M2 16.5L12 22L22 16.5L12 11L2 16.5Z" fill="#0061FF"/>
        </svg>
        <h2>ServerlessBox</h2>
      </div>

      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${currentView === 'files' ? 'active' : ''}`}
          onClick={() => setCurrentView('files')}
        >
          <FiHome className="nav-icon" />
          <span>Home</span>
        </div>
        <div 
          className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info" onClick={() => setCurrentView('profile')}>
          <div className="user-avatar">
            {user?.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="user-email">{user?.signInDetails?.loginId}</span>
        </div>
        <button onClick={signOut} className="signout-btn">
          <FiLogOut />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
