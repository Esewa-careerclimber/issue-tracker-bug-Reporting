import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userTicketRoutes from "./routes/user/tickets.js";
import adminTicketRoutes from "./routes/admin/tickets.js";
import userCommentRoutes from "./routes/user/comments.js";
import adminCommentRoutes from "./routes/admin/comments.js";
import userNotificationRoutes from "./routes/user/notifications.js";
import userDashboardRoutes from './routes/user/dashboard.js';
import userProfileRoutes from './routes/user/profile.js';
import adminDashboardRoutes from './routes/admin/dashboard.js';
import adminAnalyticsRoutes from './routes/admin/analytics.js';
import adminUserRoutes from './routes/admin/users.js';
import errorHandler from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user/tickets", userTicketRoutes);
app.use("/api/admin/tickets", adminTicketRoutes);
app.use("/api/user/comments", userCommentRoutes);
app.use("/api/admin/comments", adminCommentRoutes);
app.use("/api/user/notifications", userNotificationRoutes);
app.use("/api/user/dashboard", userDashboardRoutes);
app.use("/api/user/profile", userProfileRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/users", adminUserRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  const dbStatus =
  mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    db: dbStatus,
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Issue Tracker Backend is running!");
});

// Error handler
app.use(errorHandler);

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;

