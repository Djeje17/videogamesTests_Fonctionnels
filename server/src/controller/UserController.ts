import * as argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
//import type { IUser } from "../../../shared/interface/UserInterface.js";
import type { AuthRequest } from "../middleware.js";
import * as UserRepository from "../repository/UserRepository.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserRepository.getAll();
    console.log("Données reçues du repo :", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(`error server${error}`);
  }
};
export const getOneUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user; // Injecté par le middleware verifyToken

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return; // On arrête la fonction ici
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword); // On envoie juste la réponse
  } catch (error) {
    // console.log(error);
    res.status(500).send(`error:${error}`);
  }
};
export const createUsers = async (req: Request, res: Response) => {
  try {
    // 1. Récupérer les données envoyées par le client
    const { username, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    const userData = {
      username,
      email,
      password: hashedPassword, // On envoie le hash à la BDD !
    };

    // 2. Appeler le repository en lui passant les données
    const result = await UserRepository.create(userData);

    // 3. Envoyer une réponse positive au client
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: result.insertId, // On renvoie l'ID généré par MySQL
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as { code?: string }).code === "ER_DUP_ENTRY"
    ) {
      res.status(409).json({ message: "Pseudo ou Email déjà utilisé" });
      return;
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};
