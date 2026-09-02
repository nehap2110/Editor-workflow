const Article = require("../models/Article");

// ==========================================
// CREATE ARTICLE
// POST /api/articles
// Writer only
// ==========================================
const createArticle = async (req, res) => {
  try {
    const { title, content, summary, section } = req.body;

    // Basic validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (!section || !section.trim()) {
      return res.status(400).json({
        success: false,
        message: "Section is required",
      });
    }

    // Create article
    // IMPORTANT:
    // author comes from authenticated user, NOT req.body
    const article = await Article.create({
      title: title.trim(),
      content: content.trim(),
      summary: summary ? summary.trim() : "",
      section: section.trim(),
      author: req.user._id,
      status: "DRAFT",
    });

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Create article error:", error);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the article",
    });
  }
};

// ==========================================
// GET MY ARTICLES
// GET /api/articles/my
// Writer only
// ==========================================
const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.user._id,
    })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Get my articles error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your articles",
    });
  }
};

// ==========================================
// GET SINGLE ARTICLE
// GET /api/articles/:id
// Authenticated users
// ==========================================
const getArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate("author", "name email role")
      .populate("editor", "name email role");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // ======================================
    // WRITER AUTHORIZATION
    // ======================================
    if (req.user.role === "writer") {
      // Writer can only see their own articles
      if (article.author._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view this article",
        });
      }
    }

    // ======================================
    // EDITOR
    // ======================================
    // Editors can view articles that need
    // editorial review and published articles.
    // No extra restriction needed here.

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Get article error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the article",
    });
  }
};

// ==========================================
// UPDATE ARTICLE
// PATCH /api/articles/:id
// Writer only
// ==========================================
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content, summary, section } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // ======================================
    // CHECK OWNERSHIP
    // ======================================
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own articles",
      });
    }

    // ======================================
    // CHECK STATUS
    // ======================================
    if (
      article.status !== "DRAFT" &&
      article.status !== "CHANGES_REQUESTED"
    ) {
      return res.status(403).json({
        success: false,
        message: `Article cannot be edited while its status is ${article.status}`,
      });
    }

    // ======================================
    // UPDATE ONLY ALLOWED FIELDS
    // ======================================

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      article.title = title.trim();
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Content cannot be empty",
        });
      }

      article.content = content.trim();
    }

    if (summary !== undefined) {
      article.summary = summary.trim();
    }

    if (section !== undefined) {
      if (!section.trim()) {
        return res.status(400).json({
          success: false,
          message: "Section cannot be empty",
        });
      }

      article.section = section.trim();
    }

    // IMPORTANT:
    // We do NOT change status here.
    //
    // If status is CHANGES_REQUESTED,
    // it remains CHANGES_REQUESTED.
    //
    // The separate submit endpoint will
    // change it to SUBMITTED.

    await article.save();

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Update article error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the article",
    });
  }
};


// ==========================================
// SUBMIT ARTICLE FOR REVIEW
// POST /api/articles/:id/submit
// Writer only
// ==========================================
const submitArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    // Article doesn't exist
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // ======================================
    // CHECK OWNERSHIP
    // ======================================
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only submit your own articles",
      });
    }

    // ======================================
    // CHECK STATUS
    // ======================================
    if (
      article.status !== "DRAFT" &&
      article.status !== "CHANGES_REQUESTED"
    ) {
      return res.status(400).json({
        success: false,
        message: `Article cannot be submitted when its status is ${article.status}`,
      });
    }

    // ======================================
    // VALIDATE ARTICLE
    // ======================================

    if (!article.title || !article.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required before submitting the article",
      });
    }

    if (!article.content || !article.content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required before submitting the article",
      });
    }

    if (!article.section || !article.section.trim()) {
      return res.status(400).json({
        success: false,
        message: "Section is required before submitting the article",
      });
    }

    // ======================================
    // CHANGE STATUS
    // ======================================

    article.status = "SUBMITTED";
    article.submittedAt = new Date();

    await article.save();

    return res.status(200).json({
      success: true,
      message: "Article submitted for review successfully",
      article,
    });
  } catch (error) {
    console.error("Submit article error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the article",
    });
  }
};


// ==========================================
// GET ARTICLES FOR EDITOR REVIEW
// GET /api/articles/review
// Editor only
// ==========================================
const getReviewArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "SUBMITTED",
    })
      .populate("author", "name email role")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Get review articles error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching review articles",
    });
  }
};



module.exports = {
  createArticle,
  getMyArticles,
  getArticle,
  updateArticle,
  submitArticle,
  getReviewArticles
};
  
  