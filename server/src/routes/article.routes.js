const express = require("express");

const {
  createArticle,
  getMyArticles,
  getArticle,
  updateArticle,
  submitArticle,
  getReviewArticles,
  requestChanges,
  approveArticle,
  getPublishedArticles,
} = require("../controllers/article.controller");

const {
  publishArticle,
} = require("../controllers/article.controller");

const protect = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

// Create article — Writer only
router.post(
  "/",
  protect,
  requireRole("writer"),
  createArticle
);

// Get current writer's articles — Writer only
router.get(
  "/my",
  protect,
  requireRole("writer"),
  getMyArticles
);



// ==========================================
// GET ARTICLES FOR EDITOR REVIEW
// GET /api/articles/review
// Editor only
// ==========================================
router.get(
  "/review",
  protect,
  requireRole("editor"),
  getReviewArticles
);


router.get(
  "/published",
  protect,
  getPublishedArticles
);

// Request changes
router.post(
  "/:id/request-changes",
  protect,
  requireRole("editor"),
  requestChanges
);

// Approve
router.post(
  "/:id/approve",
  protect,
  requireRole("editor"),
  approveArticle
);

router.post(
  "/:id/publish",
  protect,
  requireRole("editor"),
  publishArticle
);

// Get single article — Any authenticated user
router.get(
  "/:id",
  protect,
  getArticle
);

// Update article — Writer only
router.patch(
  "/:id",
  protect,
  requireRole("writer"),
  updateArticle
);

// ==========================================
// SUBMIT ARTICLE FOR REVIEW
// POST /api/articles/:id/submit
// Writer only
// ==========================================
router.post(
  "/:id/submit",
  protect,
  requireRole("writer"),
  submitArticle
);




module.exports = router;