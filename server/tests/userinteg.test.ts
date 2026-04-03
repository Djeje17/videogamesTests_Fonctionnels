import * as argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
// Import the supertest library for making HTTP requests
import supertest from "supertest";
import {
  createUsers,
  getOneUser,
  getUsers,
} from "../src/controller/UserController";
// Import databaseClient
import databaseClient from "./../database/client";
import pool from "./../database/client";
import type { Result, Rows } from "./../database/client";
// Import the Express application
import app from "./../src/app";
// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/items route
describe("GET /api/users", () => {
  it("should fetch users successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/items endpoint
    const response = await supertest(app).get("/api/users");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });
});

describe("find all users", () => {
  it("should fetch users successfully", async () => {
    // On crée des mocks
    const req = { query: {} } as Partial<Request>; // On simule la requête
    const res = {
      json: jest.fn(), // On simule la fonction .json()
      status: jest.fn().mockReturnThis(), // Pour pouvoir chainer .status(200).json()
    } as Partial<Response>;

    // 2. On appelle la fonction avec les mocks
    await getUsers(req as Request, res as Response);

    // 3. On vérifie que res.json a été appelé avec les bonnes données
    expect(res.json).toHaveBeenCalled();

    // Vérifier le contenu envoyé à res.json() :
    const data = (res.json as jest.Mock).mock.calls[0][0];
    expect(data).toBeDefined();
  });
});

// Test suite for the GET /api/items/:id route
describe("GET /api/users/:id", () => {
  it("should fetch one user successfully", async () => {
    // Mock rows returned from the database
    const rows = [{ id: 1, username: "jeje" }] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/items/:id endpoint
    const response = await supertest(app).get("/api/users/1");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows[0]);
  });

  it("should fail on invalid id", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database  method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/items/:id endpoint with an invalid ID
    const response = await supertest(app).get("/api/users/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Utilisateur non trouvé");
  });
});

describe("POST /api/users", () => {
  it("should add a new user successfully", async () => {
    // Mock result of the database query
    const result = { insertId: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data
    const fakeUser = {
      username: "magic",
      email: "magic@sfr.fr",
      password: "password123",
    };

    // Send a POST request to the /api/items endpoint with a test item
    const response = await supertest(app).post("/api/users").send(fakeUser);

    // Assertions
    expect(response.status).toBe(201);
    //expect(response.body).toBeInstanceOf(Object);
    expect(response.status).toBe(201);
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { insertId: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);
    const response = await supertest(app).post("/api/users").send({});
    // Fake item data with missing user_id
    //const fakeItem = { title: "foo" };

    // Send a POST request to the /api/items endpoint with a test item
    //const response = await supertest(app).post("/api/users").send(fakeItem);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /api/register", () => {
  it("should register a new user successfully", async () => {
    const mockResult = { insertId: 1 } as Result;
    jest.spyOn(databaseClient, "query").mockResolvedValue([mockResult, []]);

    const newUser = {
      username: "tester",
      email: "test@example.com",
      password: "password123",
    };

    const response = await supertest(app).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userId", 1);
  });
});

describe("POST /api/login", () => {
  it("should login successfully and return a token", async () => {
    // 1. On simule un utilisateur trouvé en base avec un password haché
    const hashedPwd = await argon2.hash("password123");
    const mockUser = [
      {
        id: 1,
        username: "tester",
        email: "test@example.com",
        password: hashedPwd,
      },
    ] as Rows;

    jest.spyOn(databaseClient, "query").mockResolvedValue([mockUser, []]);

    // 2. Envoi de la requête de connexion
    const response = await supertest(app)
      .post("/api/connection") // ou /api/login selon ta route
      .send({ email: "test@example.com", password: "password123" });

    // 3. Vérifications
    expect(response.status).toBe(200);
    // Si tu envoies le token dans un cookie :
    expect(response.headers["set-cookie"]).toBeDefined();
    // Si tu l'envoies dans le body :
    // expect(response.body).toHaveProperty("token");
  });

  it("should fail with wrong password", async () => {
    const hashedPwd = await argon2.hash("correct_password");
    const mockUser = [{ id: 1, password: hashedPwd }] as Rows;
    jest.spyOn(databaseClient, "query").mockResolvedValue([mockUser, []]);

    const response = await supertest(app)
      .post("/api/connection")
      .send({ email: "test@example.com", password: "wrong_password" });

    expect(response.status).toBe(401); // Ou 400 selon ton code
  });

  it("should access protected route with valid token", async () => {
    // 1. Données de l'utilisateur
    const mockUser = { id: 1, username: "tester", email: "test@example.com" };

    // 2. Génération d'un token valide
    // Assure-toi que "votre_secret_par_defaut" est le même que dans ton middleware
    const testToken = jwt.sign(
      mockUser,
      process.env.APP_SECRET || "votre_secret_par_defaut",
    );

    // 3. Le Mock avec le cast "as any" pour éviter l'erreur TS2322
    jest
      .spyOn(databaseClient, "query")
      .mockResolvedValue([[mockUser] as unknown as Rows, []]);

    // 4. Appel de la route
    const response = await supertest(app)
      .get("/api/me")
      .set("Cookie", [`access_token=${testToken}`]);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "tester");
  });
});

describe("GET /api/users - Error Handling", () => {
  it("should return 500 when database query fails", async () => {
    // On force le mock à rejeter une promesse (simule une erreur SQL)
    jest
      .spyOn(databaseClient, "query")
      .mockRejectedValue(new Error("Database connection lost"));

    const response = await supertest(app).get("/api/users");

    // Assertions
    expect(response.status).toBe(500);
    // Optionnel : vérifier que vous ne divulguez pas de détails sensibles du serveur
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /api/users - Server Error", () => {
  it("should return 500 if the database fails during user creation", async () => {
    jest
      .spyOn(databaseClient, "query")
      .mockRejectedValue(new Error("Query timeout"));

    const newUser = {
      username: "crash_test",
      email: "crash@test.com",
      password: "password123",
    };

    const response = await supertest(app).post("/api/users").send(newUser);

    expect(response.status).toBe(500);
  });
});

// Arrêt des tests
afterAll(async () => {
  await pool.end();
});
