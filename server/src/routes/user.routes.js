const express = require("express");

const { getEditors,getWriters } = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

// Get editors
// Editor only
router.get(
  "/editors",
  protect,
  requireRole("editor"),
  getEditors
);

router.get(
  "/writers",
  protect,
  requireRole("editor"),
  getWriters
);

module.exports = router;