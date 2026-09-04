const User = require("../models/User");

// Get all editors
const getEditors = async (req, res, next) => {
  try {
    const editors = await User.find({
      role: "editor",
    })
      .select("name email role")
      .sort({ name: 1 });

    return res.status(200).json({
      count: editors.length,
      users: editors,
    });
  } catch (error) {
    next(error);
  }
};

const getWriters = async (req, res, next) => {
  try {
    const writers = await User.find({
      role: "writer",
    })
      .select("name email role")
      .sort({ name: 1 });

    return res.status(200).json({
      count: writers.length,
      users: writers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEditors,
  getWriters,
};