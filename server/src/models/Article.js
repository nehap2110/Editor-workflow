const mongoose = require("mongoose");

const STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "CHANGES_REQUESTED",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
];

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      trim: true,
      maxlength: 500,
    },

   section: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Section",
  required: [true, "Article section is required"],
},

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "DRAFT",
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Scheduling
    scheduledAt: {
      type: Date,
      default: null,
    },

    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    overdueAlertDismissed: {
    type: Boolean,
    default: false,
    },

    overdueAlertDismissedAt: {
    type: Date,
    default: null,
     },

   overdueAlertDismissedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    },

    editorFeedback: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

articleSchema.index({ status: 1 });
articleSchema.index({ author: 1 });

module.exports = mongoose.model("Article", articleSchema);
module.exports.STATUSES = STATUSES;