import { Router } from "express";
import { createUser2, deleteUser2, getUser2, getUsers2, updateUser2 } from "../../modules/users/users.controller.js";

export const router = Router();

router.get('/:id', getUser2);

router.get("/", getUsers2);

router.post("/", createUser2);

// The function inside is called Route Handler / Controller
router.delete("/:id", deleteUser2);

router.patch("/:id", updateUser2);