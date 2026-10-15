import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Search, User, PlusCircle, Briefcase, Home, Shield, LogOut, LogIn } from 'lucide-react';

const Navbar = ({
  search,
  setSearch,
  onOpenCreate,
  onOpenMyListings,
  onOpenMyTrips,
  onOpenAuth
}) => {
  const { user, logout, switchDemoRole, isOwner } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  const handleRoleChange = async (role) => {
    setRoleLoading(true);
    try {
      await switchDemoRole(role);
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-wrapper">
            <Compass className="brand-icon" size={28} />
          </div>
          <span className="brand-text">WanderLust</span>
        </div>

        {/* Global Search Bar */}
        <div className="search-bar-wrapper">
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Search by city, country, or villa name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button id="navbar-search-btn" className="search-btn" aria-label="Search">
            <Search size={16} />
          </button>
        </div>

        {/* Right Section: Role Switcher & User Menu */}
        <div className="navbar-actions">
          {/* Quick Demo Switcher */}
          <div className="role-switcher">
            <span className="role-switcher-label">Demo Role:</span>
            <div className="role-buttons">
              <button
                id="role-renter-btn"
                className={`role-btn ${user?.role === 'renter' ? 'active' : ''}`}
                onClick={() => handleRoleChange('renter')}
                disabled={roleLoading}
                title="Switch to Guest Traveler role"
              >
                Traveler
              </button>
              <button
                id="role-owner-btn"
                className={`role-btn ${user?.role === 'owner' ? 'active' : ''}`}
                onClick={() => handleRoleChange('owner')}
                disabled={roleLoading}
                title="Switch to Verified Property Host role"
              >
                Host
              </button>
              <button
                id="role-admin-btn"
                className={`role-btn ${user?.role === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange('admin')}
                disabled={roleLoading}
                title="Switch to Super Admin role"
              >
                Admin
              </button>
            </div>
          </div>

          {/* List Property Action */}
          {isOwner && (
            <button
              id="list-property-btn"
              className="list-property-btn"
              onClick={onOpenCreate}
            >
              <PlusCircle size={17} />
              <span>Host your home</span>
            </button>
          )}

          {/* User Menu Dropdown */}
          <div className="user-menu-wrapper">
            <button
              id="user-menu-btn"
              className="user-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar-badge">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="user-name-label">{user?.name ? user.name.split(' ')[0] : 'Account'}</span>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu fade-in">
                {user ? (
                  <>
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-role">Role: <strong className="role-tag">{user.role}</strong></p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      id="dropdown-trips-btn"
                      className="dropdown-item"
                      onClick={() => { onOpenMyTrips(); setDropdownOpen(false); }}
                    >
                      <Briefcase size={16} />
                      <span>My Bookings & Trips</span>
                    </button>
                    {isOwner && (
                      <button
                        id="dropdown-listings-btn"
                        className="dropdown-item"
                        onClick={() => { onOpenMyListings(); setDropdownOpen(false); }}
                      >
                        <Home size={16} />
                        <span>My Properties & Listings</span>
                      </button>
                    )}
                    <div className="dropdown-divider"></div>
                    <button
                      id="dropdown-logout-btn"
                      className="dropdown-item logout-item"
                      onClick={() => { logout(); setDropdownOpen(false); }}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="dropdown-login-btn"
                      className="dropdown-item"
                      onClick={() => { onOpenAuth(); setDropdownOpen(false); }}
                    >
                      <LogIn size={16} />
                      <span>Sign In / Register</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
