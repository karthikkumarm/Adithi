// types/index.ts

// Define the structure of the user object that we'll attach to the request
interface UserPayload {
    uid: string;
    role: "owner" | "retailer";
    email: string;
    name: string;
  }
  
  // Use declaration merging to add the 'user' property to the Express Request interface
  declare global {
    namespace Express {
      export interface Request {
        user?: UserPayload; // Use optional '?' as user won't exist on unauthenticated routes
      }
    }
  }
  
  // Keep your Firestore data models separate for clarity
  export interface User {
    id: string;
    email: string;
    name: string;
    role: "owner" | "retailer";
    businessName?: string;
    commissionRate?: number;
    status: "active" | "pending" | "suspended";
    isVerified: boolean;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Transaction {
    id: string;
    retailerId: string;
    amount: number;
    commission: number;
    netAmount: number;
    currency: string;
    customerDetails: {
      name: string;
      email?: string;
      phone?: string;
    };
    description?: string;
    gateway: "stripe" | "razorpay";
    gatewayTransactionId: string;
    status: string; // Changed to string to accommodate various gateway statuses
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }