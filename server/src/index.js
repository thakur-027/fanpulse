import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import opsRoutes from "./routes/ops.routes.js";
import { registerCrowdSocket } from "./sockets/crowd.socket.js";

const app = express();
const httpServer = createServer(app);

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      origin === clientOrigin ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      process.env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});
app.set("io", io);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "FanPulse Backend API is running", status: "ok" });
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ops", opsRoutes);

registerCrowdSocket(io);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    httpServer.listen(PORT, () => console.log(`FanPulse server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
