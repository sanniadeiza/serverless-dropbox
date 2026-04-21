import { useState, useEffect } from 'react';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import './Profile.css';

function Profile({ user }) {
  const [attributes, setAttributes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fields we want to edit
  const [name, setName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    setIsLoading(true);
    try {
      const attrs = await fetchUserAttributes();
      setAttributes(attrs);
      setName(attrs.name || '');
      setGivenName(attrs.given_name || '');
      setFamilyName(attrs.family_name || '');
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      setMessage({ text: 'Failed to load profile data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await updateUserAttributes({
        userAttributes: {
          name,
          given_name: givenName,
          family_name: familyName,
        },
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      loadAttributes(); // Reload to confirm changes
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile. ' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="profile-container"><div className="loading">Loading profile...</div></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Personal info</h2>
        <p>Update your photo and personal details here.</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Email address</label>
          <input 
            type="email" 
            value={attributes.email || user?.signInDetails?.loginId || ''} 
            disabled 
            className="disabled-input"
          />
          <span className="help-text">Email address cannot be changed.</span>
        </div>

        <div className="form-group row">
          <div className="col">
            <label>First name</label>
            <input 
              type="text" 
              value={givenName} 
              onChange={(e) => setGivenName(e.target.value)} 
              placeholder="e.g. John"
            />
          </div>
          <div className="col">
            <label>Last name</label>
            <input 
              type="text" 
              value={familyName} 
              onChange={(e) => setFamilyName(e.target.value)} 
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Display name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={loadAttributes} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
