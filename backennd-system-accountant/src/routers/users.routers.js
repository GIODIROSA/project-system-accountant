import { Router } from "express";
import {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controllers.js";


const router = Router();

// USUARIOS

router.get("/", getUsers);
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);



export default router;