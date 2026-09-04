const express = require("express");

const {
  createSection,
  getSections,
  getSection,
  updateSection,
  archiveSection,
  restoreSection,
  assignWriter,
  removeWriter,
} = require("../controllers/section.controller");

const  protect  = require("../middleware/auth.middleware");
const  requireRole  = require("../middleware/role.middleware");

const router = express.Router();

// Get sections
// Editor → all sections
// Writer → only assigned sections
router.get("/", protect, getSections);

// Get single section
router.get("/:id", protect, getSection);

// Create section → Editor only
router.post(
  "/",
  protect,
  requireRole("editor"),
  createSection
);

// Update section → Editor only
router.patch(
  "/:id",
  protect,
  requireRole("editor"),
  updateSection
);

// Archive section → Editor only
router.patch(
  "/:id/archive",
  protect,
  requireRole("editor"),
  archiveSection
);

// Restore section → Editor only
router.patch(
  "/:id/restore",
  protect,
  requireRole("editor"),
  restoreSection
);

// Assign writer → Editor only
router.post(
  "/:id/writers/:writerId",
  protect,
  requireRole("editor"),
  assignWriter
);

// Remove writer → Editor only
router.delete(
  "/:id/writers/:writerId",
  protect,
  requireRole("editor"),
  removeWriter
);

module.exports = router;