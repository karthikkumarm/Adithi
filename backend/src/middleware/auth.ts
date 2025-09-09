// middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken";

const db = admin.firestore();

// Best practice: Ensure JWT_SECRET is set. Fail fast if it's not.
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL_ERROR: JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = process.env.JWT_SECRET;

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
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const userData = userDoc.data()!;

    // Attach the user payload to the request object. No 'any' needed due to declaration merging.
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