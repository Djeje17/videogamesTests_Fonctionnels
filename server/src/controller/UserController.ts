import * as argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import databaseClient from "../../database/client.js";
import type { Rows } from "../../database/client.js";
//import type { IUser } from "../../../shared/interface/UserInterface.js";
import type { AuthRequest } from "../middleware.js";
import * as UserRepository from "../repository/UserRepository.js";
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserRepository.getAll();
    res.status(200).json(users);
  } catch (err) {
    // Biome sera content car on ne force pas le type 'any'
    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    res.status(500).json({
      message: `serverError: ${message}`,
    });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // On récupère l'ID depuis l'URL (ex: /api/users/1)
    const id = Number.parseInt(req.params.id);

    // On appelle le repository (assure-toi que UserRepository.getById existe)
    // Sinon, utilise UserRepository.getAll() et filtre pour le test
    const [rows] = await databaseClient.query(
      "select * from user where id = ?",
      [id],
    );
    const user = (rows as Rows)[0];

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password } = req.body;

  // Validation pour le test 400
  if (!username || !email || !password) {
    res.status(400).json({ message: "Tous les champs sont obligatoires" });
    return; // Crucial pour ne pas continuer l'exécution
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const userData = { username, email, password: hashedPassword };

    const result = await UserRepository.create(userData);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: result.insertId,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      res.status(409).json({ message: "Pseudo ou Email déjà utilisé" });
      return;
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Le middleware verifyToken a déjà mis l'utilisateur dans req.user
    if (!req.user) {
      res.status(401).json({ message: "Non connecté" });
      return;
    }

    // On extrait le mot de passe pour ne pas le renvoyer
    const { password, ...userWithoutPassword } = req.user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du profil" });
  }
};
