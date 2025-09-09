// routes/auth.ts

import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Joi from "joi";
import { authenticateToken } from  "../middleware/auth";

// Best practice: Ensure JWT_SECRET is set.
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL_ERROR: JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();
const db = admin.firestore();

// --- Validation Schemas (Unchanged) ---
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("owner", "retailer").required(),
});
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid("owner", "retailer").required(),
  businessName: Joi.string().when("role", {
    is: "retailer",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

// --- Login Endpoint ---
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { email, password, role } = value;
    const usersQuery = await db
      .collection("users")
      .where("email", "==", email)
      .where("role", "==", role)
      .limit(1)
      .get();
    if (usersQuery.empty) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const userDoc = usersQuery.docs[0];
    const userData = userDoc.data();
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { uid: userDoc.id, role: userData.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    await db.collection("users").doc(userDoc.id).update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUserData } = userData;
    res.status(200).json({ user: { id: userDoc.id, ...safeUserData }, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Register Endpoint ---
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { email, password, name, role, businessName } = value;
    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existingUser.empty) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role,
      isActive: true,
      isVerified: false,
      businessName: role === "retailer" ? businessName : null,
      commissionRate: role === "retailer" ? 0.7 : null, // Default value
      status: role === "retailer" ? "pending" : "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const userRef = await db.collection("users").add(newUser);
    await admin.auth().createUser({
      uid: userRef.id,
      email,
      displayName: name,
      emailVerified: false, // Stays false until confirmed
    });
    const token = jwt.sign({ uid: userRef.id, role }, JWT_SECRET, {
      expiresIn: "24h",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUserData } = newUser;
    res.status(201).json({ user: { id: userRef.id, ...safeUserData }, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --- Refresh Token Endpoint ---
// Use the 'authenticateToken' middleware. No 'any' type needed for req.
router.post("/refresh", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
      // req.user is now strongly typed and guaranteed to exist by the middleware
      const user = req.user!;
      const token = jwt.sign(
        { uid: user.uid, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ error: "Token refresh failed" });
    }
  }
);

export const authRoutes = router;