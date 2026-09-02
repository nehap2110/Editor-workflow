/**
 * Returns a middleware that only allows the request through if
 * req.user.role is one of the allowed roles. Must be used AFTER the
 * `protect` (authMiddleware) middleware, since it relies on req.user
 * already being set by that middleware.
 *
 * Usage:
 *   router.get("/editor-only", protect, requireRole("editor"), handler);
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Defensive check: should never happen if `protect` runs first.
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = requireRole;