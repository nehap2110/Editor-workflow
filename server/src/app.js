const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const articleRoutes = require("./routes/article.routes");
const sectionRoutes = require("./routes/section.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// --- Global middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --- Error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;