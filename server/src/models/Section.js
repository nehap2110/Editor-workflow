const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Section name is required"],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Section description is required"],
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Section owner is required"],
    },

    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

sectionSchema.index({ archived: 1 });
sectionSchema.index({ owner: 1 });
sectionSchema.index({ writers: 1 });

module.exports = mongoose.model("Section", sectionSchema);