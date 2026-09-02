const express = require("express");
const protect = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

/**
 * These routes exist only to verify, end-to-end, that authentication
 * and role authorization work correctly:
 *   - no token / invalid token  -> 401 (handled by `protect`)
 *   - valid token, wrong role   -> 403 (handled by `requireRole`)
 *   - valid token, correct role -> 200
 *
 * They use the same two roles already defined on the User model
 * ("editor", "writer") - no new roles are introduced here.
 */

router.get("/authenticated", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.name}, you are logged in as a ${req.user.role}`,
  });
});

router.get("/editor", protect, requireRole("editor"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.name}, you are authenticated as an editor`,
  });
});

router.get("/writer", protect, requireRole("writer"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.name}, you are authenticated as a writer`,
  });
});

module.exports = router;