import React, { useState, useEffect } from 'react';
import { api } from './api/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import ListingCard from './components/ListingCard';
import ListingDetailModal from './components/ListingDetailModal';
import CreateListingModal from './components/CreateListingModal';
import EditListingModal from './components/EditListingModal';
import MyListingsModal from './components/MyListingsModal';
import MyTripsModal from './components/MyTripsModal';
import AuthModal from './components/AuthModal';
import Pagination from './components/Pagination';
import { SlidersHorizontal, RefreshCw, AlertCircle, Compass, Heart } from 'lucide-react';
import './App.css';

const WanderLustApp = () => {
  const { user } = useAuth();

  // Filter & Pagination State
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  // Data State
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals State
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [myListingsOpen, setMyListingsOpen] = useState(false);
  const [myTripsOpen, setMyTripsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch listings from API with server-side pagination & filtering
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listings.getAll({
        page,
        limit,
        category,
        search,
        sort
      });
      setListings(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load property listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, sort, page]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchListings();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenMyListings={() => setMyListingsOpen(true)}
        onOpenMyTrips={() => setMyTripsOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Category Filter Carousel */}
      <CategoryBar
        selectedCategory={category}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Secondary Toolbar (Sorting & Summary) */}
        <div className="toolbar-row">
          <div className="toolbar-summary">
            <span className="stay-count-badge">
              {pagination?.total || 0} Vacation Rentals Available
            </span>
            {(category !== 'All' || search) && (
              <button
                id="reset-filters-btn"
                className="reset-filters-btn"
                onClick={handleResetFilters}
              >
                <RefreshCw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="toolbar-sort-wrapper">
            <SlidersHorizontal size={15} className="sort-icon" />
            <span className="sort-label">Sort by:</span>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="sort-dropdown"
            >
              <option value="newest">Newest Listed</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Listings Display Grid */}
        {loading ? (
          <div className="listings-loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="listing-card-skeleton">
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-line shimmer" style={{ width: '60%' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '85%' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '40%' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="listings-error-banner">
            <AlertCircle size={32} />
            <h3>Unable to load properties</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchListings}>Retry</button>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-results-box">
            <Compass size={48} className="empty-compass" />
            <h3>No exact matches found</h3>
            <p>Try adjusting your search criteria, clearing filters, or exploring other categories.</p>
            <button className="btn-primary" onClick={handleResetFilters}>
              Browse All Homes
            </button>
          </div>
        ) : (
          <>
            <div className="listings-grid">
              {listings.map((item) => (
                <ListingCard
                  key={item._id}
                  listing={item}
                  onSelect={(l) => setSelectedListingId(l._id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-inner">
          <div className="footer-left">
            <span>© 2026 WanderLust, Inc.</span>
            <span className="dot-sep">•</span>
            <span>Privacy</span>
            <span className="dot-sep">•</span>
            <span>Terms</span>
            <span className="dot-sep">•</span>
            <span>Sitemap</span>
          </div>
          <div className="footer-center">
            <span className="tech-badge">MERN Stack (MongoDB • Express.js • React.js • Node.js)</span>
          </div>
          <div className="footer-right">
            <span>Built by <strong>Sampat Sarkar</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedListingId && (
        <ListingDetailModal
          listingId={selectedListingId}
          onClose={() => setSelectedListingId(null)}
          onBookingSuccess={() => {
            fetchListings();
          }}
        />
      )}

      {createModalOpen && (
        <CreateListingModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            fetchListings();
            alert('Property successfully created and published!');
          }}
        />
      )}

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            fetchListings();
            setEditingListing(null);
            alert('Property details updated successfully.');
          }}
        />
      )}

      {myListingsOpen && (
        <MyListingsModal
          onClose={() => setMyListingsOpen(false)}
          onEditListing={(item) => {
            setMyListingsOpen(false);
            setEditingListing(item);
          }}
          onOpenCreate={() => {
            setMyListingsOpen(false);
            setCreateModalOpen(true);
          }}
        />
      )}

      {myTripsOpen && (
        <MyTripsModal
          onClose={() => setMyTripsOpen(false)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WanderLustApp />
    </AuthProvider>
  );
}
