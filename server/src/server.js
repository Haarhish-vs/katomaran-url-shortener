import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";

dotenv.config();

const app = express();

app.get("/", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      database: "Connected",
      users: userCount,
      message: "Backend Running Successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});