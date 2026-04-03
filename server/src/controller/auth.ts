import * as argon2 from "argon2";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IUser } from "../../../interface/UserInterface";
import * as UserRepository from "../repository/UserRepository.js";

dotenv.config();

export const connection = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = (await UserRepository.getUserByEmail(email)) as IUser | null;

    // 1. On récupère le tableau d'utilisateurs

    if (!user) {
      res.status(401).json({ message: "Identifiants invalides" });
      return;
    }

    // 2. Comparaison du mot de passe (si tu as utilisé argon2 à l'inscription)
    // Note : Si à l'inscription tu n'as pas haché le MDP, argon2.verify échouera.
    const isValidePassword = await argon2.verify(user.password, password);

    if (!isValidePassword) {
      res.status(401).json({ message: "Identifiants invalides" });
      return;
    }

    // 3. Génération du Token (utilise la même clé que dans ton middleware !)
    const secret =
      process.env.APP_SECRET || "dgjshdfguykdshgdfkjhgfjdsf0011231141.20231$$";
    const generateToken = jwt.sign(
      { user_id: user.id, user_email: user.email, role: "user" },
      secret,
      { expiresIn: "30d" },
    );

    // 4. Envoi du Cookie
    res.cookie("access_token", generateToken, {
      httpOnly: true, // Sécurité : empêche le JS côté client de lire le cookie
      secure: false, // INDISPENSABLE en localhost
      sameSite: "lax", // INDISPENSABLE pour que le cookie circule entre port 3000 et 3310
      maxAge: 8 * 3600000,
    });

    res.status(200).json({
      message: "Connexion réussie",
      username: user.username, // Optionnel : renvoie le nom pour React
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
