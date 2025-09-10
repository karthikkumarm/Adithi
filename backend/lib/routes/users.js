"use strict";
// routes/users.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const db = admin.firestore();
// Apply authentication middleware to all routes in this file
router.use(auth_1.authenticateToken);
// --- Get User Profile Endpoint ---
router.get("/profile", async (req, res) => {
    try {
        const user = req.user; // req.user is typed and guaranteed to be present
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const userData = userDoc.data();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password } = userData, safeUserData = __rest(userData, ["password"]);
        res.status(200).json(Object.assign({ id: userDoc.id }, safeUserData));
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Failed to get profile" });
    }
});
// --- Get Retailers Endpoint (Owner Only) ---
router.get("/retailers", async (req, res) => {
    try {
        const user = req.user; // req.user is typed
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
            const _a = doc.data(), { password } = _a, data = __rest(_a, ["password"]);
            return Object.assign({ id: doc.id }, data);
        });
        res.status(200).json({ retailers });
    }
    catch (error) {
        console.error("Get retailers error:", error);
        res.status(500).json({ error: "Failed to get retailers" });
    }
});
exports.userRoutes = router;
//# sourceMappingURL=users.js.map