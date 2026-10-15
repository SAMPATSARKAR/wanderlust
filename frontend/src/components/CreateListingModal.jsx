import React, { useState } from 'react';
import { api } from '../api/api';
import { X, Plus, AlertCircle } from 'lucide-react';

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

const AVAILABLE_AMENITIES = [
  'Wifi',
  'Kitchen',
  'Infinity Pool',
  'Sauna',
  'Hot Tub',
  'Air Conditioning',
  'Free Parking',
  'Dedicated Workspace',
  'Sea View',
  'Outdoor Fire Pit'
];

const CreateListingModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    price: 250,
    location: '',
    country: '',
    category: 'Trending',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Wifi', 'Kitchen', 'Air Conditioning']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.listings.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Host a New Property</h2>
          <button id="close-create-modal-btn" className="modal-close-btn" onClick={onClose}>
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
              id="create-title-input"
              type="text"
              name="title"
              placeholder="e.g. Cliffside Glass Villa with Panoramic Sea Views"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Location / City</label>
              <input
                id="create-location-input"
                type="text"
                name="location"
                placeholder="e.g. Positano, Amalfi"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                id="create-country-input"
                type="text"
                name="country"
                placeholder="e.g. Italy"
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
                id="create-category-select"
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
                id="create-price-input"
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
            <label>Primary Image URL (High Resolution)</label>
            <input
              id="create-image-input"
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label>Max Guests</label>
              <input
                id="create-guests-input"
                type="number"
                name="maxGuests"
                min="1"
                value={formData.maxGuests}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                id="create-bedrooms-input"
                type="number"
                name="bedrooms"
                min="1"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                id="create-bathrooms-input"
                type="number"
                name="bathrooms"
                min="1"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              id="create-description-input"
              name="description"
              rows="3"
              placeholder="Describe the architectural uniqueness, views, and ambience of your property..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Included Amenities</label>
            <div className="amenity-checkbox-grid">
              {AVAILABLE_AMENITIES.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`amenity-chip ${formData.amenities.includes(item) ? 'selected' : ''}`}
                  onClick={() => handleAmenityToggle(item)}
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="publish-listing-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <Plus size={16} />
              <span>{loading ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;
