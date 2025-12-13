import React, { useState } from 'react';
import './App.css';

function App() {
  // State management
  const [currentTab, setCurrentTab] = useState('create');
  const [orgData, setOrgData] = useState({
    organization_name: '',
    email: '',
    password: ''
  });
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });
  const [updateData, setUpdateData] = useState({
    organization_name: '',
    email: '',
    password: ''
  });
  const [deleteOrgName, setDeleteOrgName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '');

  // Backend API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Helper function to make API calls
  const makeApiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setApiResponse(null);

    try {
      const config = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Add auth token if required
      if (requiresAuth && authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (response.ok) {
        setApiResponse(data);
        return data;
      } else {
        setErrorMessage(data.message || 'Request failed');
        return null;
      }
    } catch (err) {
      setErrorMessage('Cannot connect to server. Please ensure backend is running on ' + API_BASE_URL);
      console.error('API Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create organization
  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    
    if (!orgData.organization_name || !orgData.email || !orgData.password) {
      setErrorMessage('All fields are required');
      return;
    }

    const result = await makeApiRequest('/org/create', 'POST', orgData);
    
    if (result) {
      setOrgData({ organization_name: '', email: '', password: '' });
    }
  };

  // Admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginCredentials.email || !loginCredentials.password) {
      setErrorMessage('Email and password are required');
      return;
    }

    const result = await makeApiRequest('/admin/login', 'POST', loginCredentials);
    
    if (result && result.token) {
      setAuthToken(result.token);
      localStorage.setItem('auth_token', result.token);
      setLoginCredentials({ email: '', password: '' });
    }
  };

  // Search organization
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter an organization name');
      return;
    }

    await makeApiRequest(`/org/get/${searchQuery.trim()}`, 'GET');
  };

  // Update organization
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!updateData.organization_name.trim()) {
      setErrorMessage('Organization name is required');
      return;
    }

    if (!updateData.email && !updateData.password) {
      setErrorMessage('Please provide email or password to update');
      return;
    }

    const updatePayload = {};
    if (updateData.email) updatePayload.email = updateData.email;
    if (updateData.password) updatePayload.password = updateData.password;

    const result = await makeApiRequest(
      `/org/update/${updateData.organization_name.trim()}`, 
      'PUT', 
      updatePayload
    );

    if (result) {
      setUpdateData({ organization_name: '', email: '', password: '' });
    }
  };

  // Delete organization
  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!authToken) {
      setErrorMessage('You must be logged in to delete an organization');
      return;
    }

    if (!deleteOrgName.trim()) {
      setErrorMessage('Please enter organization name to delete');
      return;
    }

    // Confirmation
    if (!window.confirm(`Are you sure you want to delete "${deleteOrgName}"? This action cannot be undone.`)) {
      return;
    }

    const result = await makeApiRequest(
      `/org/delete/${deleteOrgName.trim()}`, 
      'DELETE',
      null,
      true // requires auth
    );

    if (result) {
      setDeleteOrgName('');
    }
  };

  // Logout
  const handleLogout = () => {
    setAuthToken('');
    localStorage.removeItem('auth_token');
    setApiResponse(null);
    setErrorMessage(null);
  };

  // Switch tabs and clear messages
  const switchTab = (tab) => {
    setCurrentTab(tab);
    setApiResponse(null);
    setErrorMessage(null);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="main-title">Organization Management Portal</h1>
            <p className="subtitle">Multi-Tenant SaaS Backend System</p>
          </div>
        </header>

        {/* Auth Status */}
        {authToken && (
          <div className="auth-banner">
            <span className="auth-text">✓ Authenticated</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="main-card">
          {/* Navigation Tabs */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${currentTab === 'create' ? 'active' : ''}`}
              onClick={() => switchTab('create')}
            >
              <span className="tab-icon">➕</span>
              <span>Create</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              <span className="tab-icon">🔐</span>
              <span>Login</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'search' ? 'active' : ''}`}
              onClick={() => switchTab('search')}
            >
              <span className="tab-icon">🔍</span>
              <span>Search</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'update' ? 'active' : ''}`}
              onClick={() => switchTab('update')}
            >
              <span className="tab-icon">✏️</span>
              <span>Update</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'delete' ? 'active' : ''}`}
              onClick={() => switchTab('delete')}
            >
              <span className="tab-icon">🗑️</span>
              <span>Delete</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* CREATE TAB */}
            {currentTab === 'create' && (
              <div className="form-section">
                <h2 className="section-title">Create New Organization</h2>
                <form onSubmit={handleCreateOrganization} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      name="organization_name"
                      className="form-input"
                      placeholder="e.g., tech_company"
                      value={orgData.organization_name}
                      onChange={(e) => setOrgData({...orgData, organization_name: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admin Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="admin@company.com"
                      value={orgData.email}
                      onChange={(e) => setOrgData({...orgData, email: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={orgData.password}
                      onChange={(e) => setOrgData({...orgData, password: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Creating...' : '✨ Create Organization'}
                  </button>
                </form>
              </div>
            )}

            {/* LOGIN TAB */}
            {currentTab === 'login' && (
              <div className="form-section">
                <h2 className="section-title">Admin Login</h2>
                <form onSubmit={handleLogin} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={loginCredentials.email}
                      onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={loginCredentials.password}
                      onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : '🔓 Login'}
                  </button>
                </form>
              </div>
            )}

            {/* SEARCH TAB */}
            {currentTab === 'search' && (
              <div className="form-section">
                <h2 className="section-title">Find Organization</h2>
                <form onSubmit={handleSearch} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter organization name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Searching...' : '🔎 Search'}
                  </button>
                </form>
              </div>
            )}

            {/* UPDATE TAB */}
            {currentTab === 'update' && (
              <div className="form-section">
                <h2 className="section-title">Update Organization</h2>
                <form onSubmit={handleUpdate} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Organization Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter organization name"
                      value={updateData.organization_name}
                      onChange={(e) => setUpdateData({...updateData, organization_name: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Email (optional)</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="new@email.com"
                      value={updateData.email}
                      onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password (optional)</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="New password"
                      value={updateData.password}
                      onChange={(e) => setUpdateData({...updateData, password: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Updating...' : '💾 Update Organization'}
                  </button>
                </form>
              </div>
            )}

            {/* DELETE TAB */}
            {currentTab === 'delete' && (
              <div className="form-section">
                <h2 className="section-title">Delete Organization</h2>
                
                {!authToken && (
                  <div className="warning-box">
                    <p>⚠️ You must be logged in to delete an organization</p>
                  </div>
                )}

                <form onSubmit={handleDelete} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter organization name to delete"
                      value={deleteOrgName}
                      onChange={(e) => setDeleteOrgName(e.target.value)}
                      disabled={isLoading || !authToken}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn delete-btn" 
                    disabled={isLoading || !authToken}
                  >
                    {isLoading ? 'Deleting...' : '🗑️ Delete Organization'}
                  </button>
                </form>
              </div>
            )}

            {/* Success Response */}
            {apiResponse && (
              <div className="response-box success-box">
                <h3 className="response-title">✓ Success</h3>
                <div className="response-content">
                  <pre className="json-display">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errorMessage && (
              <div className="response-box error-box">
                <h3 className="response-title">✗ Error</h3>
                <p className="error-text">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>Built with React + Node.js + Express + MongoDB</p>
          <p>Multi-Tenant Architecture • JWT Authentication • RESTful API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;