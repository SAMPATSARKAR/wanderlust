import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { X, Calendar, MapPin, AlertCircle, Briefcase, CheckCircle, XCircle } from 'lucide-react';

const MyTripsModal = ({ onClose }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.bookings.getMyTrips();
      setTrips(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.bookings.cancel(id);
      await fetchTrips();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container dashboard-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h2 className="modal-title">My Bookings & Trips</h2>
            <p className="modal-subtitle">View your upcoming vacations, past stays, and reservation details.</p>
          </div>
          <button id="close-my-trips-btn" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="dashboard-content-body">
          {loading ? (
            <div className="modal-loading-state">
              <div className="spinner"></div>
              <p>Loading your reservations...</p>
            </div>
          ) : error ? (
            <div className="modal-error-state">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="empty-state-card">
              <Briefcase size={36} className="empty-icon" />
              <h3>No trips booked... yet!</h3>
              <p>Time to dust off your bags and start planning your next great adventure with WanderLust.</p>
              <button id="start-searching-trips-btn" className="btn-primary" onClick={onClose}>
                Start Searching Stays
              </button>
            </div>
          ) : (
            <div className="dashboard-items-list">
              {trips.map((b) => (
                <div key={b._id} className="dashboard-item-card trip-card">
                  <img
                    src={b.listing?.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
                    alt={b.listing?.title}
                    className="dashboard-item-img"
                  />
                  <div className="dashboard-item-details">
                    <div className="dashboard-item-top">
                      <span className={`status-pill ${b.status}`}>
                        {b.status === 'confirmed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>{b.status.toUpperCase()}</span>
                      </span>
                      <span className="booking-ref-id">ID: #{b._id.slice(-6)}</span>
                    </div>

                    <h4 className="dashboard-item-title">{b.listing?.title || 'Vacation Property'}</h4>

                    <div className="trip-meta-row">
                      <div className="meta-sub-item">
                        <MapPin size={14} />
                        <span>{b.listing?.location}, {b.listing?.country}</span>
                      </div>
                      <div className="meta-sub-item">
                        <Calendar size={14} />
                        <span>
                          {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()} ({b.totalNights} nights)
                        </span>
                      </div>
                    </div>

                    <div className="trip-price-row">
                      <span>Total Paid: <strong>${b.totalPrice}</strong> ({b.guests} guest{b.guests > 1 ? 's' : ''})</span>
                    </div>
                  </div>

                  <div className="dashboard-item-actions">
                    {b.status === 'confirmed' && (
                      <button
                        id={`cancel-booking-btn-${b._id}`}
                        className="btn-danger-outline"
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
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

export default MyTripsModal;
