import type { ResultSetHeader } from "mysql2";
import type { IUser } from "../../../interface/UserInterface";
import { client } from "../../database/client.js";

export const getAll = async (): Promise<IUser[]> => {
  const [rows] = await client.query("SELECT * FROM user");
  return rows as IUser[];
};
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const [rows] = await client.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    const users = rows as IUser[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const create = async (user: IUser): Promise<ResultSetHeader> => {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "INSERT INTO user(username, email, password) VALUES (?, ?, ?)",
      [user.username, user.email, user.password],
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
