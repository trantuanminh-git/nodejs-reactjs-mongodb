import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

// connect to mongoose
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connect to mongoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected");
});
mongoose.connection.on("connected", () => {
    console.log("mongoDB connected");
});

// MIDDLEWARE
app.use(cors())
app.use(cookieParser()); // cookieParser is used to parse token into our cookie
app.use(express.json()); // this middleware is used to send json from the req to server

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.get("/", (req, res) => {
    res.send("hello fire");
});

app.listen(8800, () => {
    connect();
    console.log("connected to backend!");
});
