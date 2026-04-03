import express from "express";
import { createGames, getGames } from "./controller/GameController";
import {
  createUsers,
  getMe,
  getOneUser,
  getUsers,
} from "./controller/UserController.js";
import { connection } from "./controller/auth.js";
import { verifyToken } from "./middleware.js";
//import express, { Request, Response } from "express";
// 1. On crée l'instance (souvent appelée 'router' ou 'route' avec une minuscule)
const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getOneUser);
router.post("/users", createUsers);

router.get("/games", getGames);
router.post("/game", createGames);
router.post("/connection", connection);
router.get("/me", verifyToken, getMe);
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Déconnecté" });
});
/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
//import itemActions from "./modules/item/itemActions";

//router.get("/api/items", itemActions.browse);
//router.get("/api/items/:id", itemActions.read);
//router.post("/api/items", itemActions.add);

/* ************************************************************************* */

export default router;
