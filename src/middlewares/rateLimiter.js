import rateLimit from "express-rate-limit";

// ติดต่อได้กี่ครั้งภายในกรอบเวลาเท่าไร
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit maximum request for each IP address per 15 minutes
    standardHeaders: true, // use the latest header
    legacyHeaders: false,
});