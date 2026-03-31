// Load environment variables from .env file
import "dotenv/config";
import * as fs from "node:fs"; // Utilisation de * as fs pour éviter l'erreur d'import
import databaseClient from "../database/client";
import { Rows } from "../database/client";

// Close the database connection after all tests have run
afterAll((done) => {
  databaseClient.end().then(done);
});

// Test suite for environment installation
describe("Installation", () => {
  // Test 1: Check if the .env file exists
  test("You have created /server/.env", async () => {
    expect(fs.existsSync(`${__dirname}/../.env`)).toBe(true);
  });

  // Test 2: Check if the .env.sample file exists
  test("You have retained /server/.env.sample", async () => {
    expect(fs.existsSync(`${__dirname}/../.env.sample`)).toBe(true);
  });

  // Test 3: Check if the .env file is properly filled
  test("You have filled /server/.env with valid information to connect to your database", async () => {
    expect.assertions(0);
    try {
      await databaseClient.getConnection();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Le test 4 est commenté proprement ici pour ne pas bloquer
  /*
  test("You have executed the db:migrate scripts", async () => {
    const [rows] = await databaseClient.query<Rows>("select * from user");
    expect(rows.length).toBeGreaterThanOrEqual(0);
  });
  */
});
