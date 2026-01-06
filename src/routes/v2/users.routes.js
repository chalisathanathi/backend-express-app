import { Router } from "express";
import { createUser2, deleteUser2, getUser2, getUsers2, updateUser2 } from "../../modules/users/users.controller.js";
import { User } from "../../modules/users/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/auth.js";

export const router = Router();

router.get('/:id', getUser2);

router.get("/", getUsers2);

router.post("/", authUser, createUser2);

// The function inside is called Route Handler / Controller
router.delete("/:id", authUser, deleteUser2);

router.patch("/:id", authUser, updateUser2);

// Log-in a user - jwt signed token (token in cookies)
router.post("/auth/cookie/login", async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            error: true,
            message: "Email and Password are required (´▽`ʃ♡ƪ)",
        });
    };

    try {
        const normalizedEmail = String(email).trim().toLowerCase();

        const user = await User.findOne({email: normalizedEmail}).select("+password");

        if(!user){
            return res.status(401).json({
                error: true,
                message: "User not found (ﾉ*ФωФ)ﾉ",
            });
        };

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.status(401).json({
                error: true,
                message: "Invalid password (。﹏。*)"
            });
        };

        // public เข้าถึงได้ ห้ามใส่ข้อมูล private เด็ดขาด
        // Generate JSON Web Token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60*60*1000, // 1hr
        });

        res.status(200).json({
            error: false,
            message: "Login successful (≧∀≦)ゞ",
            token: token,
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    };
});

// Logout a user
router.post("/auth/cookie/logout", (req, res) => {
    const isProd = process.env.NODE_ENV === "production"

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({
        error: false,
        message: "Logged out successfully φ(゜▽゜*)♪",
    });
})

//Check user authentication (check if user has valid token)
router.get("/auth/cookie/me", authUser, async (req, res, next) => {
    try {
        const userId = req.user.user._id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                error: true,
                message: "Unauthenticated",
            })
        };

        res.status(200).json({
            error: false,
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        next(error);
    }
});