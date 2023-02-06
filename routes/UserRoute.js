import express from "express";
import {
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../controller/User.js";
import { verify, adminOnly } from "../middleware/authuser.js";
const router = express.Router();

router.get("/users", verify, adminOnly, getUsers);
router.get("/users/:uuid", verify, adminOnly, getUsersById);
router.post("/users", verify, adminOnly, createUsers);
router.patch("/users/:uuid", verify, adminOnly, updateUsers);
router.delete("/users/:uuid", verify, adminOnly, deleteUsers);
// semua parameter menggunakan uuid
// user yang ingin masuk ke endpoint di atas,wajib login terlebih dahulu
export default router;
