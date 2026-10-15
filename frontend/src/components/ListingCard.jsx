import React from 'react';
import { Star, MapPin } from 'lucide-react';

const ListingCard = ({ listing, onSelect }) => {
  return (
    <div
      id={`listing-card-${listing._id}`}
      className="listing-card"
      onClick={() => onSelect(listing)}
    >
      <div className="card-image-container">
        <img
          src={listing.image}
          alt={listing.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-badges">
          <span className="card-category-badge">{listing.category}</span>
          {listing.featured && <span className="card-featured-badge">Featured</span>}
        </div>
      </div>

      <div className="card-content">
        <div className="card-header-row">
          <div className="card-location">
            <MapPin size={15} className="location-pin" />
            <span>{listing.location}, {listing.country}</span>
          </div>
          <div className="card-rating">
            <Star size={15} className="star-icon" />
            <span>{listing.rating ? listing.rating.toFixed(1) : '4.8'}</span>
            <span className="card-review-count">({listing.reviewCount || 0})</span>
          </div>
        </div>

        <h3 className="card-title">{listing.title}</h3>

        <div className="card-footer-row">
          <div className="card-price-wrapper">
            <span className="card-price">${listing.price}</span>
            <span className="card-price-period"> / night</span>
          </div>
          <span className="card-guests-hint">{listing.maxGuests || 4} guests</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
