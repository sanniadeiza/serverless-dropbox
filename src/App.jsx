import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('files');

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <Sidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            signOut={signOut} 
            user={user} 
          />
          <main className="app-main">
            {currentView === 'files' && <Dashboard user={user} />}
            {currentView === 'profile' && <Profile user={user} />}
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
