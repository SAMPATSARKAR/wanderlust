const Listing = require('../models/Listing');

/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies that the authenticated user possesses one of the authorized roles.
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to perform this operation.`
      });
    }

    next();
  };
};

/**
 * Resource Ownership Authorization Middleware
 * Ensures only the creator/owner of a listing or a system Admin can modify/delete it.
 */
const authorizeListingOwner = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id || req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    // Admins bypass ownership restriction
    if (req.user.role === 'admin') {
      req.listing = listing;
      return next();
    }

    // Check if the authenticated user is the listing owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You are not authorized to modify or delete this property listing.'
      });
    }

    req.listing = listing;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authorizeRoles,
  authorizeListingOwner
};
