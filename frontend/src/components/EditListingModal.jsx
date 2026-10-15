import React, { useState } from 'react';
import { api } from '../api/api';
import { X, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Trending',
  'Cabins',
  'Beachfront',
  'Iconic Cities',
  'Lakefront',
  'Castles',
  'Desert',
  'Tropical',
  'Countryside'
];

const EditListingModal = ({ listing, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    image: listing?.image || '',
    price: listing?.price || 100,
    location: listing?.location || '',
    country: listing?.country || '',
    category: listing?.category || 'Trending',
    maxGuests: listing?.maxGuests || 4,
    bedrooms: listing?.bedrooms || 2,
    bathrooms: listing?.bathrooms || 1
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
      await api.listings.update(listing._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Property Listing</h2>
          <button id="close-edit-modal-btn" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-group">
            <label>Property Title</label>
            <input
              id="edit-title-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Location / City</label>
              <input
                id="edit-location-input"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                id="edit-country-input"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Category</label>
              <select
                id="edit-category-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Nightly Price ($ USD)</label>
              <input
                id="edit-price-input"
                type="number"
                name="price"
                min="10"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Primary Image URL</label>
            <input
              id="edit-image-input"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              id="edit-description-input"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="save-changes-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;
