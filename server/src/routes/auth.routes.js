const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateRequest.middleware");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);

module.exports = router;