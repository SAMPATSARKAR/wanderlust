import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { X, Edit2, Trash2, Plus, AlertCircle, Home, Star } from 'lucide-react';

const MyListingsModal = ({ onClose, onEditListing, onOpenCreate }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await api.listings.getMyListings();
      setListings(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.listings.delete(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container dashboard-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h2 className="modal-title">My Properties & Listings</h2>
            <p className="modal-subtitle">Manage your hosted vacation properties and bookings.</p>
          </div>
          <button id="close-my-listings-btn" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="dashboard-content-body">
          <div className="dashboard-action-bar">
            <span className="count-badge">Total: {listings.length} properties</span>
            <button
              id="host-another-btn"
              className="btn-primary-sm"
              onClick={() => { onClose(); onOpenCreate(); }}
            >
              <Plus size={15} />
              <span>Host Another Home</span>
            </button>
          </div>

          {loading ? (
            <div className="modal-loading-state">
              <div className="spinner"></div>
              <p>Loading your properties...</p>
            </div>
          ) : error ? (
            <div className="modal-error-state">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state-card">
              <Home size={36} className="empty-icon" />
              <h3>No properties hosted yet</h3>
              <p>You haven't listed any vacation rentals under this account. Publish your first property now!</p>
              <button
                id="empty-host-first-btn"
                className="btn-primary"
                onClick={() => { onClose(); onOpenCreate(); }}
              >
                Host Your First Property
              </button>
            </div>
          ) : (
            <div className="dashboard-items-list">
              {listings.map((l) => (
                <div key={l._id} className="dashboard-item-card">
                  <img src={l.image} alt={l.title} className="dashboard-item-img" />
                  <div className="dashboard-item-details">
                    <div className="dashboard-item-top">
                      <span className="dashboard-cat-pill">{l.category}</span>
                      <div className="dashboard-rating">
                        <Star size={13} className="star-filled" />
                        <span>{l.rating ? l.rating.toFixed(1) : '4.8'}</span>
                      </div>
                    </div>
                    <h4 className="dashboard-item-title">{l.title}</h4>
                    <p className="dashboard-item-sub">{l.location}, {l.country}</p>
                    <p className="dashboard-item-price"><strong>${l.price}</strong> / night</p>
                  </div>
                  <div className="dashboard-item-actions">
                    <button
                      id={`edit-listing-btn-${l._id}`}
                      className="action-icon-btn edit-btn"
                      onClick={() => onEditListing(l)}
                      title="Edit property details"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      id={`delete-listing-btn-${l._id}`}
                      className="action-icon-btn delete-btn"
                      onClick={() => handleDelete(l._id, l.title)}
                      title="Delete property"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListingsModal;
