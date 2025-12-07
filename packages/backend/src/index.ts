import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import twoFactorRoutes from "./routes/twoFactor";
import cryptoRoutes from "./routes/crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Auth routes
app.use("/auth", authRoutes);
app.use("/auth/2fa", twoFactorRoutes);

// Crypto market data routes
app.use("/api/crypto", cryptoRoutes);

// TODO: Add KYC endpoints, wallet operations, and APIs for your frontend.
app.get("/", (_req, res) => res.send("Slowsteady backend running"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
