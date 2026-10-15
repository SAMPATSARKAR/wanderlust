import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <strong>{startItem} – {endItem}</strong> of <strong>{total}</strong> verified homes
      </div>

      <div className="pagination-controls">
        <button
          id="prev-page-btn"
          className="pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          title="Previous Page"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <div className="pagination-numbers">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                id={`page-btn-${pageNum}`}
                className={`page-num-btn ${page === pageNum ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          id="next-page-btn"
          className="pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          title="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
