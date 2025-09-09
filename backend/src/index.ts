
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import routes
import { authRoutes } from "./routes/auth";
import { paymentRoutes } from "./routes/payments";
import { userRoutes } from "./routes/users"; // <-- Import user routes

// Route handlers
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/users", userRoutes); // <-- Use user routes

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

export const api = functions.https.onRequest(app);