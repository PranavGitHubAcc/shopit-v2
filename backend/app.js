import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

dotenv.config({ path: "backend/config/config.env" });

// Handling uncaught errors
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to uncaught errors");
    process.exit(1);
});

// Connnecting to database
connectDatabase();
app.use(express.json());

app.use(cookieParser());
// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js"
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(
        `server started on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode`
    );
});

// Handle Unhandeled Promise Rejections

process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhadled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});
