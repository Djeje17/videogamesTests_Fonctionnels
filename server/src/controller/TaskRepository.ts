import type { Request, Response } from "express";
import type { ITask } from "../../../interface/TaskInterface";
import * as TaskRepository from "../repository/TaskRepository.js";

export const getTask = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskRepository.getAll();
    console.log("Données reçues du repo :", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(`error server${error}`);
  }
};
export const createTasks = async (req: Request, res: Response) => {
  try {
    // 1. Récupérer les données envoyées par le client
    const taskData: ITask = req.body;
    console.log(taskData);
    // 2. Appeler le repository en lui passant les données
    const result = await TaskRepository.create(taskData);

    // 3. Envoyer une réponse positive au client
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      taskId: result.insertId, // On renvoie l'ID généré par MySQL
    });
  } catch (error) {
    // 4. En cas d'erreur, on informe le client
    console.error("Erreur lors de la création :", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
    });
  }
};
