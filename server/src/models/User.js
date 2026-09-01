const mongoose = require("mongoose");

const ROLES = ["editor", "writer"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: "Role must be either 'editor' or 'writer'",
      },
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

/**
 * Whenever a User document is converted to JSON (e.g. sent in an API
 * response), strip out the password hash and Mongo's internal __v field.
 * This is a safety net in addition to `select: false` above, so that a
 * password hash can never accidentally leak in a response.
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;