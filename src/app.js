import express from "express";
import cors from "cors";
import {router as apiRoutes} from "./routes/index.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter } from "./middlewares/rateLimiter.js";

export const app = express();

app.set("trust proxy", 1);

// Global middleware: 1 big middleware with various tiny ones in it
app.use(helmet());

// ระบุว่า frontend ไหนบ้างที่เชื่อมกับ backend อันนี้ได้
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://frontend-react-app-mu.vercel.app",
    ],
    credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());

// Middleware to parse cookies (required for cookie-based auth)
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World ╰(*°▽°*)╯");
});

app.use("/api", apiRoutes);
//ถ้าหน้าไม่เยอะ apiRoutes สามารถถูกแทนที่ด้วยฟังก์ชั่นโดยตรงได้เลย

// Catch-all for 404 not found (ยังไม่ใช่ centralize middleware)
// next คือ build-in method ที่ใช้ในการส่งของที่ middleware หนึ่งทำเสร็จแล้ว เตรียมจะส่งให้ middleware อีกอัน
app.use((req, res, next) => {
    // เป็นการเรียก build-in object ของ JS มาใช้งาน (เป็น class แบบ OOP) คือเราไม่ได้สร้าง Error นี้ขึ้นมาเอง เราแค่เรียกมาใช้งานเฉยๆ
    // method อะไรที่ FE ส่งมา กับ originalURL endpoint อะไรที่ FE ส่งมา ว่ามันน error ตรงไหน ซึ่งมันคือ key ที่มีอยู่แล้ว
    const error = new Error(`Not found: ${req.method} ${req.originalUrl} (✿◡‿◡)`);
    // name คือชื่อของ error ชนิดนั้น
    // มันคือการตั้งชื่อให้ error ชนิดนี้นั่นแหละ = NotFoundError
    error.name = "NotFoundError";
    // ตั้ง status ให้ error นี้
    error.status = 404;
    // จะทำการส่ง error นี้ ไปให้ middleware ที่จะจัดการเกี่ยวกับ error ต่อไป
    // ใช้ method next ในการส่ง error ออกไป
    next(error);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error ψ(｀∇´)ψ",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: err.stack,
    });
});