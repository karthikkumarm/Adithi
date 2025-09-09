// routes/users.ts

import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const db = admin.firestore();

// Apply authentication middleware to all routes in this file
router.use(authenticateToken);

// --- Get User Profile Endpoint ---
router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!; // req.user is typed and guaranteed to be present
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userData = userDoc.data()!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUserData } = userData;

    res.status(200).json({ id: userDoc.id, ...safeUserData });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// --- Get Retailers Endpoint (Owner Only) ---
router.get("/retailers", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!; // req.user is typed
    if (user.role !== "owner") {
      res.status(403).json({ error: "Access denied: requires owner privileges" });
      return;
    }

    const retailersQuery = await db
      .collection("users")
      .where("role", "==", "retailer")
      .orderBy("createdAt", "desc")
      .get();

    const retailers = retailersQuery.docs.map((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = doc.data();
      return { id: doc.id, ...data };
    });

    res.status(200).json({ retailers });
  } catch (error) {
    console.error("Get retailers error:", error);
    res.status(500).json({ error: "Failed to get retailers" });
  }
});

export const userRoutes = router;