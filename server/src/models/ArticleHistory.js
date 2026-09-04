const mongoose = require("mongoose");

const articleHistorySchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "CREATED",
        "STATUS_CHANGE",
        "REVISION_CREATED",
        "REVISION_STATUS_CHANGE",
        "COMMENT",
      ],
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    oldStatus: {
      type: String,
      default: null,
    },

    newStatus: {
      type: String,
      default: null,
    },

    revision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleRevision",
      default: null,
    },

    comment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

articleHistorySchema.index({
  article: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "ArticleHistory",
  articleHistorySchema
);