import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';

const AuthModal = ({ onClose }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'renter'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({ email: formData.email, password: formData.password });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container auth-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isRegister ? 'Create an Account' : 'Welcome to WanderLust'}</h2>
          <button id="close-auth-modal-btn" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-modal-body">
          {/* Fast 1-Click Demo Role Buttons */}
          <div className="demo-accounts-box">
            <p className="demo-box-title">Quick Demo Logins (Instant Role Access):</p>
            <div className="demo-buttons-grid">
              <button
                type="button"
                className="demo-pill-btn host-pill"
                onClick={() => handleDemoClick('owner')}
                disabled={loading}
              >
                <ShieldCheck size={14} />
                <span>Sign in as Host (Sampat)</span>
              </button>
              <button
                type="button"
                className="demo-pill-btn traveler-pill"
                onClick={() => handleDemoClick('renter')}
                disabled={loading}
              >
                <User size={14} />
                <span>Sign in as Traveler (Alex)</span>
              </button>
              <button
                type="button"
                className="demo-pill-btn admin-pill"
                onClick={() => handleDemoClick('admin')}
                disabled={loading}
              >
                <Lock size={14} />
                <span>Sign in as Admin</span>
              </button>
            </div>
          </div>

          <div className="or-divider">
            <span>OR USE EMAIL</span>
          </div>

          {error && (
            <div className="form-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <User size={17} className="input-icon" />
                    <input
                      id="auth-name-input"
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <select
                    id="auth-role-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="renter">Traveler / Guest (Book Stays)</option>
                    <option value="owner">Property Host (List & Manage Homes)</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={17} className="input-icon" />
                <input
                  id="auth-email-input"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={17} className="input-icon" />
                <input
                  id="auth-password-input"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Log In'}
            </button>
          </form>

          <div className="auth-toggle-footer">
            <p>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="toggle-auth-btn"
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
              >
                {isRegister ? 'Log in here' : 'Sign up for free'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
