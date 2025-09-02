import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.config.js";

// Load ENV
console.log("\n================= 🌱 Dotenv Loaded =================");


const PORT = process.env.PORT || 5000;

async function startServer(port) {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("🚀 ===============================================");
      console.log(`✅  Server is running on:  http://localhost:${PORT}`);
      console.log("🚀 ===============================================\n");
    });
  } catch (error) {
    console.error("\n❌ Error starting server:", error.message, "\n");
    process.exit(1);
  }
}

startServer(PORT);
