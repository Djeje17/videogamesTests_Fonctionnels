import type { Request, Response } from "express";
import type { IGame } from "../../../shared/interface/GameInterface.js";
import * as GameRepository from "../repository/GameRepository.js";

export const getGames = async (req: Request, res: Response) => {
  try {
    const games = await GameRepository.getAll();
    console.log("Données reçues du repo :", games);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).send(`error server${error}`);
  }
};
export const createGames = async (req: Request, res: Response) => {
  try {
    // 1. Récupérer les données envoyées par le client
    const gameData: IGame = req.body;
    console.log(gameData);
    // 2. Appeler le repository en lui passant les données
    const result = await GameRepository.create(gameData);

    // 3. Envoyer une réponse positive au client
    res.status(201).json({
      message: "jeu créé avec succès",
      gameId: result.insertId, // On renvoie l'ID généré par MySQL
    });
  } catch (error) {
    // 4. En cas d'erreur, on informe le client
    console.error("Erreur lors de la création :", error);
    res.status(500).json({
      message: "Erreur lors de la création du jeu",
    });
  }
};
