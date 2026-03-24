import type { ResultSetHeader } from "mysql2";
import type { IGame } from "../../../shared/interface/GameInterface.js";
import { client } from "../../database/client.js";

export const getAll = async (): Promise<IGame[]> => {
  try {
    const [game] = await client.query("SELECT * FROM game");
    return game as IGame[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const create = async (game: IGame): Promise<ResultSetHeader> => {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "INSERT INTO game(title, description, engine, status) VALUES (?, ?, ?, ?)",
      [game.title, game.description, game.engine, game.status],
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
