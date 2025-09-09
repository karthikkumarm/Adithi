// routes/payments.ts

import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import Razorpay from "razorpay";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth";

// --- Environment Variable Checks ---
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("FATAL_ERROR: STRIPE_SECRET_KEY is not set.");
}
if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("FATAL_ERROR: RAZORPAY_KEY_ID is not set.");
}
if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("FATAL_ERROR: RAZORPAY_KEY_SECRET is not set.");
}

const router = Router();
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil", // This will work after you run 'npm install stripe@latest'
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Validation Schema ---
const processPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default("USD"),
  paymentMethod: Joi.string().required(),
  customerDetails: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
  }).required(),
  description: Joi.string().optional(),
  gateway: Joi.string().valid("stripe", "razorpay").default("stripe"),
});

// Apply authentication to all routes in this file
router.use(authenticateToken);

// --- Process Payment Endpoint ---
router.post("/process", async (req: Request, res: Response): Promise<void> => {
  try {
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
      paymentResult = await processStripePayment({
        amount: Math.round(amount * 100),
        currency,
        paymentMethod,
        customerDetails,
        description: description || `Payment to ${businessName}`,
        metadata: {
          transactionId,
          retailerId: user.uid,
          businessName: businessName,
        },
      });
    } else if (gateway === "razorpay") {
      paymentResult = await processRazorpayPayment({
        amount: Math.round(amount * 100),
        currency,
        description: description || `Payment to ${businessName}`,
        notes: {
          transactionId,
          retailerId: user.uid,
          businessName: businessName,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email || "",
          customer_contact: customerDetails.phone || "",
        },
      });
    }

    if (!paymentResult) {
      res.status(502).json({ error: "Payment gateway did not return a result" });
      return;
    }

    const commissionRate = retailerData.commissionRate || 0.7;
    const commission = (amount * commissionRate) / 100;
    const netAmount = amount - commission;

    const transactionData = {
      id: transactionId,
      retailerId: user.uid,
      amount,
      commission,
      netAmount,
      currency,
      customerDetails,
      description,
      gateway,
      gatewayTransactionId: paymentResult.id,
      status: paymentResult.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("transactions").doc(transactionId).set(transactionData);

    await db.collection("users").doc(user.uid).update({
      "stats.totalTransactions": admin.firestore.FieldValue.increment(1),
      "stats.totalVolume": admin.firestore.FieldValue.increment(amount),
      "stats.totalCommission": admin.firestore.FieldValue.increment(commission),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      transaction: {
        id: transactionId,
        status: paymentResult.status,
        gatewayTransactionId: paymentResult.id,
      },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// --- Helper Functions ---
async function processStripePayment(params: {
  amount: number;
  currency: string;
  paymentMethod: string;
  customerDetails: { name: string; email?: string };
  description: string;
  metadata: Record<string, string>;
}): Promise<{ id: string; status: string }> {
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

async function processRazorpayPayment(params: {
  amount: number;
  currency: string;
  description: string;
  notes: Record<string, string>;
}): Promise<{ id: string; status: string }> {
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