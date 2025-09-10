"use strict";
// src/routes/payments.ts
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
exports.paymentRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const razorpay_1 = __importDefault(require("razorpay"));
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
// --- DELETED: Top-level environment checks and SDK initializations were removed from here ---
const router = (0, express_1.Router)();
const db = admin.firestore();
// --- Validation Schema (Unchanged) ---
const processPaymentSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
    currency: joi_1.default.string().length(3).default("INR"), // Changed default to INR for India
    paymentMethod: joi_1.default.string().when("gateway", { is: "stripe", then: joi_1.default.required() }),
    customerDetails: joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().optional(),
        phone: joi_1.default.string().optional(),
    }).required(),
    description: joi_1.default.string().optional(),
    gateway: joi_1.default.string().valid("stripe", "razorpay").default("razorpay"),
});
// Apply authentication to all routes in this file
router.use(auth_1.authenticateToken);
// --- Process Payment Endpoint ---
router.post("/process", async (req, res) => {
    try {
        // MOVED: Environment checks and SDK initializations are now safely inside the handler.
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!stripeSecretKey || !razorpayKeyId || !razorpayKeySecret) {
            console.error("FATAL_ERROR: Payment gateway secrets are not configured.");
            res.status(500).json({ error: "Internal server configuration error." });
            return;
        }
        // Initialize SDKs inside the handler
        const stripe = new stripe_1.default(stripeSecretKey, { apiVersion: "2025-08-27.basil" });
        const razorpay = new razorpay_1.default({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
        const { error, value } = processPaymentSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { amount, currency, paymentMethod, customerDetails, description, gateway } = value;
        const user = req.user;
        if (user.role !== "retailer") {
            res.status(403).json({ error: "Only retailers can process payments" });
            return;
        }
        const retailerDoc = await db.collection("users").doc(user.uid).get();
        const retailerData = retailerDoc.data();
        if (!retailerData || retailerData.status !== "active") {
            res.status(403).json({ error: "Retailer account is not active" });
            return;
        }
        let paymentResult = null;
        const transactionId = (0, uuid_1.v4)();
        const businessName = retailerData.businessName || "Your Business";
        if (gateway === "stripe") {
            paymentResult = await processStripePayment(stripe, {
                amount: Math.round(amount * 100),
                currency,
                paymentMethod,
                customerDetails,
                description: description || `Payment to ${businessName}`,
                metadata: { transactionId, retailerId: user.uid, businessName },
            });
        }
        else if (gateway === "razorpay") {
            paymentResult = await processRazorpayPayment(razorpay, {
                amount: Math.round(amount * 100),
                currency,
                description: description || `Payment to ${businessName}`,
                notes: {
                    transactionId,
                    retailerId: user.uid,
                    businessName,
                    customer_name: customerDetails.name,
                    customer_email: customerDetails.email || "",
                    customer_contact: customerDetails.phone || "",
                },
            });
        }
        // ... (rest of the logic is the same)
        res.status(200).json({
            transaction: { id: transactionId, status: paymentResult === null || paymentResult === void 0 ? void 0 : paymentResult.status, gatewayTransactionId: paymentResult === null || paymentResult === void 0 ? void 0 : paymentResult.id },
        });
    }
    catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ error: "Payment processing failed" });
    }
});
// --- Helper Functions ---
// ADDED: Accept the SDK client as a parameter
async function processStripePayment(stripe, params) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        payment_method: params.paymentMethod,
        description: params.description,
        metadata: params.metadata,
        confirm: true,
        return_url: "https://your-app.com/payment-return",
    });
    return { id: paymentIntent.id, status: paymentIntent.status };
}
// ADDED: Accept the SDK client as a parameter
async function processRazorpayPayment(razorpay, params) {
    const order = await razorpay.orders.create({
        amount: params.amount,
        currency: params.currency,
        payment_capture: true,
        receipt: params.notes.transactionId,
        notes: params.notes,
    });
    return { id: order.id, status: order.status };
}
exports.paymentRoutes = router;
//# sourceMappingURL=payments.js.map