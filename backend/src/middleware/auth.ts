// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken";

const db = admin.firestore();

interface DecodedToken {
  uid: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // MOVED THE CHECK FROM THE TOP LEVEL TO INSIDE THE FUNCTION
  const jwtSecret = process.env.JWT_SECRET;

  // This check now runs only when the endpoint is called, not during deployment analysis.
  if (!jwtSecret) {
    console.error("FATAL_ERROR: JWT_SECRET is not configured in the function's environment.");
    // Send a generic error to the client for security
    res.status(500).json({ error: "Internal server configuration error." });
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const userData = userDoc.data()!;

    req.user = {
      uid: decoded.uid,
      role: userData.role,
      email: userData.email,
      name: userData.name,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};