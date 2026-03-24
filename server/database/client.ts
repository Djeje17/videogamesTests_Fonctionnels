import mysql from "mysql2/promise";
import type {
  Pool,
  PoolOptions,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
// Get variables from .env file for database connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

import dotenv from "dotenv";
// Create a connection pool to the database

dotenv.config();
const config: PoolOptions = {
  host: DB_HOST || "localhost",
  port: Number.parseInt(DB_PORT as string),
  user: DB_USER || "root",
  password: DB_PASSWORD || "root",
  database: DB_NAME || "videogames",
};

// Ready to export
export const client: Pool = mysql.createPool(config);
// Types export
export default client;

// 5. Exports de types
export type DatabaseClient = mysql.Pool;
export type Result = ResultSetHeader;
export type Rows = RowDataPacket[];
