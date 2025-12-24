import { Router } from "express";
import { createUser, deleteUser, getUsers, testAPI } from "../../modules/users/users.controller.js";

export const router = Router();

router.get('/test', testAPI);

router.get("/", getUsers);

router.post("/", createUser);

// The function inside is called Route Handler / Controller
router.delete("/:id", deleteUser);