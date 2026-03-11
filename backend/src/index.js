import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import path from "path";
import authRoutes from "../src/routes/auth.route.js";
import messageRoute from "../src/routes/message.route.js"
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import { app, server } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())

app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONTEND_URL,
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDb();
})