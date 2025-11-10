import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import authRoutes from "../src/routes/auth.route.js";
import messageRoute from "../src/routes/message.route.js"
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import {app,server}from "./config/socket.js";
dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

const PORT =process.env.PORT;
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoute);

server.listen(PORT,()=>{console.log(`http://localhost:${PORT}`)
connectDb();
})