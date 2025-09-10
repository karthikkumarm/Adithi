// src/routes/payments.ts

import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import Razorpay from "razorpay";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth";

// --- DELETED: Top-level environment checks and SDK initializations were removed from here ---

const router = Router();
const db = admin.firestore();

// --- Validation Schema (Unchanged) ---
const processPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default("INR"), // Changed default to INR for India
  paymentMethod: Joi.string().when("gateway", { is: "stripe", then: Joi.required() }),
  customerDetails: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
  }).required(),
  description: Joi.string().optional(),
  gateway: Joi.string().valid("stripe", "razorpay").default("razorpay"),
});

// Apply authentication to all routes in this file
router.use(authenticateToken);

// --- Process Payment Endpoint ---
router.post("/process", async (req: Request, res: Response): Promise<void> => {
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
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-08-27.basil" });
    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

    const { error, value } = processPaymentSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { amount, currency, paymentMethod, customerDetails, description, gateway } = value;
    const user = req.user!;

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

    let paymentResult: { id: string; status: string } | null = null;
    const transactionId = uuidv4();
    const businessName = retailerData.businessName || "Your Business";

    if (gateway === "stripe") {
      paymentResult = await processStripePayment(stripe, { // PASSED: Pass the initialized client
        amount: Math.round(amount * 100),
        currency,
        paymentMethod,
        customerDetails,
        description: description || `Payment to ${businessName}`,
        metadata: { transactionId, retailerId: user.uid, businessName },
      });
    } else if (gateway === "razorpay") {
      paymentResult = await processRazorpayPayment(razorpay, { // PASSED: Pass the initialized client
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
      transaction: { id: transactionId, status: paymentResult?.status, gatewayTransactionId: paymentResult?.id },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// --- Helper Functions ---
// ADDED: Accept the SDK client as a parameter
async function processStripePayment(
  stripe: Stripe,
  params: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerDetails: { name: string; email?: string };
    description: string;
    metadata: Record<string, string>;
  }
): Promise<{ id: string; status: string }> {
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
async function processRazorpayPayment(
  razorpay: Razorpay,
  params: {
    amount: number;
    currency: string;
    description: string;
    notes: Record<string, string>;
  }
): Promise<{ id: string; status: string }> {
  const order = await razorpay.orders.create({
    amount: params.amount,
    currency: params.currency,
    payment_capture: true,
    receipt: params.notes.transactionId,
    notes: params.notes,
  });
  return { id: order.id, status: order.status };
}

export const paymentRoutes = router;