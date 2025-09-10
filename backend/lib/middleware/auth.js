"use strict";
// src/middleware/auth.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const admin = __importStar(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = admin.firestore();
const authenticateToken = async (req, res, next) => {
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
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const userDoc = await db.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        const userData = userDoc.data();
        req.user = {
            uid: decoded.uid,
            role: userData.role,
            email: userData.email,
            name: userData.name,
        };
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map