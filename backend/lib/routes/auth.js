"use strict";
// src/routes/auth.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../middleware/auth");
// --- DELETED: The top-level JWT_SECRET check was removed from here ---
const router = (0, express_1.Router)();
const db = admin.firestore();
// --- Validation Schemas (Unchanged) ---
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid("owner", "retailer").required(),
});
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    name: joi_1.default.string().min(2).required(),
    role: joi_1.default.string().valid("owner", "retailer").required(),
    businessName: joi_1.default.string().when("role", {
        is: "retailer",
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
});
// --- Login Endpoint ---
router.post("/login", async (req, res) => {
    try {
        // ADDED: Check for secret inside the function
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("FATAL_ERROR: JWT_SECRET is not configured.");
            res.status(500).json({ error: "Internal server configuration error." });
            return;
        }
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
        const isValidPassword = await bcryptjs_1.default.compare(password, userData.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ uid: userDoc.id, role: userData.role }, jwtSecret, // Use the new variable
        { expiresIn: "24h" });
        await db.collection("users").doc(userDoc.id).update({
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _ } = userData, safeUserData = __rest(userData, ["password"]);
        res.status(200).json({ user: Object.assign({ id: userDoc.id }, safeUserData), token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});
// --- Register Endpoint (CHANGED) ---
// ADDED: 'authenticateToken' to make this a protected, admin-only route
router.post("/register", auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        // ADDED: Check for secret inside the function
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("FATAL_ERROR: JWT_SECRET is not configured.");
            res.status(500).json({ error: "Internal server configuration error." });
            return;
        }
        // ADDED: Role check to ensure only an owner can create new users
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'owner') {
            res.status(403).json({ error: "Access denied: requires owner privileges." });
            return;
        }
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
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
            emailVerified: false,
        });
        const token = jsonwebtoken_1.default.sign({ uid: userRef.id, role }, jwtSecret, {
            expiresIn: "24h",
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _ } = newUser, safeUserData = __rest(newUser, ["password"]);
        res.status(201).json({ user: Object.assign({ id: userRef.id }, safeUserData), token });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});
// --- Refresh Token Endpoint ---
router.post("/refresh", auth_1.authenticateToken, async (req, res) => {
    try {
        // ADDED: Check for secret inside the function
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("FATAL_ERROR: JWT_SECRET is not configured.");
            res.status(500).json({ error: "Internal server configuration error." });
            return;
        }
        const user = req.user;
        const token = jsonwebtoken_1.default.sign({ uid: user.uid, role: user.role }, jwtSecret, // Use the new variable
        { expiresIn: "24h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Token refresh error:", error);
        res.status(500).json({ error: "Token refresh failed" });
    }
});
exports.authRoutes = router;
//# sourceMappingURL=auth.js.map