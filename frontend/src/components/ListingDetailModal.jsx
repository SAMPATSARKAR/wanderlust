import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import { X, Star, MapPin, Users, Bed, Bath, CheckCircle, Trash2, Send, ShieldCheck, AlertCircle } from 'lucide-react';

const ListingDetailModal = ({ listingId, onClose, onBookingSuccess }) => {
  const { user, isOwner } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reservation Form State
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const fourDaysLater = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(tomorrow);
  const [checkOut, setCheckOut] = useState(fourDaysLater);
  const [guests, setGuests] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.listings.getById(listingId);
      setListing(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchDetails();
    }
  }, [listingId]);

  // Calculate pricing breakdown
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !listing) return { nights: 0, subtotal: 0, fee: 0, total: 0 };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    const subtotal = nights * listing.price;
    const fee = Math.round(subtotal * 0.12);
    const total = subtotal + fee;
    return { nights, subtotal, fee, total };
  };

  const { nights, subtotal, fee, total } = calculateTotal();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingMessage({ type: 'error', text: 'Please sign in to complete your reservation.' });
      return;
    }

    if (listing.owner?._id === user._id) {
      setBookingMessage({ type: 'error', text: 'You cannot book your own property listing.' });
      return;
    }

    setBookingLoading(true);
    setBookingMessage(null);

    try {
      await api.bookings.create({
        listingId: listing._id,
        checkIn,
        checkOut,
        guests: Number(guests)
      });
      setBookingMessage({ type: 'success', text: 'Reservation confirmed! View details in My Trips.' });
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message || 'Booking reservation failed.' });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newComment.trim()) return;

    setReviewLoading(true);
    try {
      await api.reviews.add(listing._id, {
        rating: Number(newRating),
        comment: newComment
      });
      setNewComment('');
      await fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.reviews.delete(listing._id, reviewId);
      await fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  if (!listingId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container detail-modal fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="modal-badge">{listing?.category}</span>
            <h2 className="modal-title">{listing?.title}</h2>
            <div className="modal-sub-location">
              <MapPin size={16} />
              <span>{listing?.location}, {listing?.country}</span>
            </div>
          </div>
          <button id="close-detail-modal-btn" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="modal-loading-state">
            <div className="spinner"></div>
            <p>Loading property details...</p>
          </div>
        ) : error ? (
          <div className="modal-error-state">
            <AlertCircle size={28} />
            <p>{error}</p>
          </div>
        ) : (
          <div className="modal-scrollable-body">
            {/* Gallery Section */}
            <div className="detail-gallery-grid">
              <div className="gallery-main-image">
                <img src={listing.image} alt={listing.title} />
              </div>
              {listing.gallery && listing.gallery.length > 1 && (
                <div className="gallery-secondary-image">
                  <img src={listing.gallery[1]} alt="Interior view" />
                </div>
              )}
            </div>

            <div className="detail-two-column-layout">
              {/* Left Column: Description, Specs, Amenities, Reviews */}
              <div className="detail-main-content">
                {/* Host Info Banner */}
                <div className="host-info-card">
                  <img
                    src={listing.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                    alt={listing.owner?.name}
                    className="host-avatar"
                  />
                  <div>
                    <h4 className="host-name">Hosted by {listing.owner?.name || 'Verified Superhost'}</h4>
                    <p className="host-bio">{listing.owner?.bio || 'Dedicated host passionate about great travel stays.'}</p>
                  </div>
                  <div className="superhost-tag">
                    <ShieldCheck size={16} />
                    <span>Verified Host</span>
                  </div>
                </div>

                {/* Property Specs Pill Row */}
                <div className="property-specs-row">
                  <div className="spec-item"><Users size={18} /><span>Up to {listing.maxGuests} guests</span></div>
                  <div className="spec-item"><Bed size={18} /><span>{listing.bedrooms} bedrooms</span></div>
                  <div className="spec-item"><Bath size={18} /><span>{listing.bathrooms} baths</span></div>
                </div>

                {/* Description */}
                <div className="detail-section">
                  <h3 className="section-title">About this space</h3>
                  <p className="description-text">{listing.description}</p>
                </div>

                {/* Amenities */}
                <div className="detail-section">
                  <h3 className="section-title">What this place offers</h3>
                  <div className="amenities-grid">
                    {listing.amenities && listing.amenities.map((item, idx) => (
                      <div key={idx} className="amenity-item">
                        <CheckCircle size={16} className="amenity-check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="detail-section reviews-section">
                  <div className="reviews-header-row">
                    <h3 className="section-title">Guest Reviews</h3>
                    <div className="reviews-aggregate-badge">
                      <Star size={17} className="star-filled" />
                      <span>{listing.rating?.toFixed(1) || '4.8'}</span>
                      <span className="aggregate-count">({listing.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Submit Review Form */}
                  {user ? (
                    <form onSubmit={handleAddReview} className="add-review-form">
                      <div className="review-input-header">
                        <span className="rating-prompt">Your Rating:</span>
                        <select
                          id="review-rating-select"
                          value={newRating}
                          onChange={(e) => setNewRating(e.target.value)}
                          className="rating-select"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                          <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                          <option value="3">⭐⭐⭐ (3 - Average)</option>
                          <option value="2">⭐⭐ (2 - Below Average)</option>
                          <option value="1">⭐ (1 - Disappointing)</option>
                        </select>
                      </div>
                      <div className="review-textarea-row">
                        <textarea
                          id="review-comment-textarea"
                          rows="3"
                          placeholder="Share your experience staying at this property..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          required
                        />
                        <button
                          id="submit-review-btn"
                          type="submit"
                          className="submit-review-btn"
                          disabled={reviewLoading}
                        >
                          <Send size={16} />
                          <span>{reviewLoading ? 'Posting...' : 'Post Review'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="login-to-review-hint">Please sign in to leave a review for this property.</p>
                  )}

                  {/* Reviews List */}
                  <div className="reviews-list">
                    {listing.reviews && listing.reviews.length > 0 ? (
                      listing.reviews.map((rev) => (
                        <div key={rev._id} className="review-card">
                          <div className="review-card-header">
                            <div className="review-author-info">
                              <img
                                src={rev.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                alt={rev.author?.name}
                                className="review-author-avatar"
                              />
                              <div>
                                <h5 className="review-author-name">{rev.author?.name || 'Guest Traveler'}</h5>
                                <span className="review-date">
                                  {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="review-header-actions">
                              <div className="review-stars-pill">
                                <Star size={13} className="star-filled" />
                                <span>{rev.rating}</span>
                              </div>
                              {(user?._id === rev.author?._id || user?.role === 'admin') && (
                                <button
                                  className="delete-review-btn"
                                  onClick={() => handleDeleteReview(rev._id)}
                                  title="Delete your review"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="review-comment-text">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="empty-reviews-text">No reviews yet for this listing. Be the first to leave one!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Reservation Booking Box */}
              <div className="detail-sidebar">
                <div className="booking-card-widget">
                  <div className="booking-card-header">
                    <div>
                      <span className="booking-nightly-price">${listing.price}</span>
                      <span className="booking-nightly-label"> / night</span>
                    </div>
                    <div className="booking-card-rating">
                      <Star size={15} className="star-filled" />
                      <span>{listing.rating?.toFixed(1) || '4.8'}</span>
                    </div>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="booking-form">
                    <div className="booking-dates-grid">
                      <div className="date-input-field">
                        <label>CHECK-IN</label>
                        <input
                          id="booking-checkin-date"
                          type="date"
                          value={checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                        />
                      </div>
                      <div className="date-input-field">
                        <label>CHECKOUT</label>
                        <input
                          id="booking-checkout-date"
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="guests-select-field">
                      <label>GUESTS</label>
                      <select
                        id="booking-guests-select"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      >
                        {[...Array(listing.maxGuests || 4)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} guest{i > 0 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      id="confirm-reservation-btn"
                      type="submit"
                      className="confirm-booking-btn"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? 'Processing...' : 'Reserve Property'}
                    </button>
                  </form>

                  {bookingMessage && (
                    <div className={`booking-notification ${bookingMessage.type}`}>
                      {bookingMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span>{bookingMessage.text}</span>
                    </div>
                  )}

                  <p className="booking-charge-notice">You won't be charged yet</p>

                  <div className="booking-breakdown-list">
                    <div className="breakdown-item">
                      <span>${listing.price} x {nights} nights</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>WanderLust service fee (12%)</span>
                      <span>${fee}</span>
                    </div>
                    <div className="breakdown-divider"></div>
                    <div className="breakdown-item total-item">
                      <strong>Total before taxes</strong>
                      <strong>${total}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailModal;
