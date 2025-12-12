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
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '');

  // Backend API URL - change this when deploying
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Helper function to handle API calls
  const makeApiRequest = async (endpoint, method = 'GET', body = null) => {
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

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (response.ok) {
        setApiResponse(data);
        return data;
      } else {
        setErrorMessage(data.message || 'Something went wrong');
        return null;
      }
    } catch (err) {
      setErrorMessage('Failed to connect to server. Make sure backend is running.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new organization
  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    
    if (!orgData.organization_name || !orgData.email || !orgData.password) {
      setErrorMessage('All fields are required');
      return;
    }

    const result = await makeApiRequest('/org/create', 'POST', orgData);
    
    if (result) {
      // Clear form on success
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
    
    if (!searchQuery) {
      setErrorMessage('Please enter an organization name');
      return;
    }

    await makeApiRequest(`/org/get/${searchQuery}`, 'GET');
  };

  // Logout
  const handleLogout = () => {
    setAuthToken('');
    localStorage.removeItem('auth_token');
    setApiResponse(null);
    setErrorMessage(null);
  };

  // Update form inputs
  const updateFormField = (setter) => (e) => {
    setter(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header Section */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="main-title">Organization Management Portal</h1>
            <p className="subtitle">Multi-Tenant SaaS Backend System</p>
          </div>
        </header>

        {/* Authentication Status */}
        {authToken && (
          <div className="auth-banner">
            <span className="auth-text">✓ Logged In</span>
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
              onClick={() => {
                setCurrentTab('create');
                setApiResponse(null);
                setErrorMessage(null);
              }}
            >
              <span className="tab-icon">🏢</span>
              <span>Create</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('login');
                setApiResponse(null);
                setErrorMessage(null);
              }}
            >
              <span className="tab-icon">🔐</span>
              <span>Login</span>
            </button>
            <button
              className={`tab-button ${currentTab === 'search' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('search');
                setApiResponse(null);
                setErrorMessage(null);
              }}
            >
              <span className="tab-icon">🔍</span>
              <span>Search</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Create Organization Form */}
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
                      placeholder="e.g., my_company"
                      value={orgData.organization_name}
                      onChange={updateFormField(setOrgData)}
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
                      onChange={updateFormField(setOrgData)}
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
                      onChange={updateFormField(setOrgData)}
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Organization'}
                  </button>
                </form>
              </div>
            )}

            {/* Login Form */}
            {currentTab === 'login' && (
              <div className="form-section">
                <h2 className="section-title">Admin Login</h2>
                <form onSubmit={handleLogin} className="input-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={loginCredentials.email}
                      onChange={updateFormField(setLoginCredentials)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={loginCredentials.password}
                      onChange={updateFormField(setLoginCredentials)}
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            )}

            {/* Search Form */}
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

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </form>
              </div>
            )}

            {/* Success Response Display */}
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
          <p>Built with React + Node.js + MongoDB</p>
          <p>RESTful API • JWT Authentication • Multi-Tenant Architecture</p>
        </footer>
      </div>
    </div>
  );
}

export default App;