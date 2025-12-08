import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import twoFactorRoutes from "./routes/twoFactor";
import stripeRoutes from "./routes/stripe";
import contractsRoutes from "./routes/contracts";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet()); // Sets various HTTP headers for security

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stripe webhook needs raw body BEFORE other middleware
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// CORS configuration - restrict origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Auth routes
app.use("/auth", authRoutes);
app.use("/auth/2fa", twoFactorRoutes);

// Stripe payment routes
app.use("/api/stripe", stripeRoutes);

// Contract management routes
app.use("/api/contracts", contractsRoutes);

// TODO: Add KYC endpoints, wallet operations, and APIs for your frontend.
app.get("/", (_req, res) => res.send("Slowsteady backend running"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
