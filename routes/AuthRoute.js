import express from "express";
import { login, me, logout } from "../controller/Auth.js";
const route = express.Router();
route.post("/login", login);
route.get("/me", me);
route.delete("/logout", logout);

export default route;
