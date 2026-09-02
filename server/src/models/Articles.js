const mongoose = require("mongoose");

const STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "CHANGES_REQUESTED",
  "APPROVED",
  "PUBLISHED",
];

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, trim: true, maxlength: 500 },
    section: { type: String, trim: true, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: STATUSES, default: "DRAFT" },
    feedback: { type: String, trim: true, default: "" },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

articleSchema.index({ status: 1 });
articleSchema.index({ author: 1 });

module.exports = mongoose.model("Article", articleSchema);
module.exports.STATUSES = STATUSES;