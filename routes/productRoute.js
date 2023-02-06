import express from "express";
import {
  getProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProducts,
} from "../controller/Product.js";
import { verify } from "../middleware/authuser.js";

const router = express.Router();
router.get("/products", verify, getProducts);
router.get("/products/:uuid", verify, getProductsById);
router.post("/products", verify, createProducts);
router.patch("/products/:uuid", verify, updateProducts);
router.delete("/products/:uuid", verify, deleteProducts);
// di verifikasi dulu apakah sudah login
export default router;
