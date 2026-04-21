import { Authenticator } from '@aws-amplify/ui-react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <header className="app-header">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#0061FF"/>
                <path d="M2 16.5L12 22L22 16.5L12 11L2 16.5Z" fill="#0061FF"/>
              </svg>
              <h1>ServerlessBox</h1>
            </div>
            <div className="user-controls">
              <span>Welcome, {user?.signInDetails?.loginId}</span>
              <button onClick={signOut} className="signout-button">Sign Out</button>
            </div>
          </header>
          <main className="app-main">
            <Dashboard user={user} />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
