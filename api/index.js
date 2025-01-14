import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
