import type { ResultSetHeader } from "mysql2";
import type { ITask } from "../../../interface/TaskInterface";
import { client } from "../../database/client.js";

export const getAll = async (): Promise<ITask[]> => {
  try {
    const [task] = await client.query("SELECT * FROM task");
    return task as ITask[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const create = async (task: ITask): Promise<ResultSetHeader> => {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "INSERT INTO task(label, category, priority) VALUES (?, ?, ?)",
      [task.label, task.category, task.priority],
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
