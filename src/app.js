import express from "express";
import cors from "cors";
import {router as apiRoutes} from "./routes/index.js";

export const app = express();

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://frontend-react-app-mu.vercel.app/",
    ],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", apiRoutes);
//ถ้าหน้าไม่เยอะ apiRoutes สามารถถูกแทนที่ด้วยฟังก์ชั่นโดยตรงได้เลย