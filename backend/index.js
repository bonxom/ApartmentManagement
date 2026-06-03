import "dotenv/config";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";

import permissionRoutes from "./routes/permissionRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

import householdRoutes from "./routes/householdRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { defaultInit } from "./config/initialize.js";
import requestRoutes from "./routes/requestRoutes.js";

import feeRoutes from "./routes/feeRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";

const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;
if (!Number.isInteger(PORT) || PORT <= 0 || PORT >= 65536) {
    //throw new Error("Invalid PORT environment variable");
}

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`);
  });
  next();
});

await connectDB();
console.log("Connected to Database");

await defaultInit();

app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/households", householdRoutes);
app.use("/api/requests", requestRoutes);

app.use("/api/fees", feeRoutes);
app.use("/api/transactions", transactionRoutes)
app.use("/api/stats", statsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

export default app;
