require("dotenv").config();
const {
  publishScheduledContent,
} = require("./jobs/publishScheduler");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

      // Check scheduled content immediately
    publishScheduledContent();


      setInterval(
      publishScheduledContent,
      60 * 1000
      
    );

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();