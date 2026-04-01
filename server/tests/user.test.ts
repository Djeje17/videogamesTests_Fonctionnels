import type { Request, Response } from "express";
import {
  createUsers,
  getOneUser,
  getUsers,
} from "../src/controller/UserController";
import pool from "./../database/client";

// Nettoie aprés chaque test
afterEach(() => {
  jest.restoreAllMocks();
  console.log("nettoyé");
});

describe("find all users", () => {
  it("should fetch users successfully", async () => {
    // On crée des mocks
    const req = {} as Request; // On simule la requête
    const res = {
      json: jest.fn(), // On simule la fonction .json()
      status: jest.fn().mockReturnThis(), // Pour pouvoir chainer .status(200).json()
    } as unknown as Response;

    // 2. On appelle la fonction avec les mocks
    await getUsers(req, res);

    // 3. On vérifie que res.json a été appelé avec les bonnes données
    expect(res.json).toHaveBeenCalled();

    // Vérifier le contenu envoyé à res.json() :
    const data = (res.json as jest.Mock).mock.calls[0][0];
    expect(data).toBeDefined();
  });
});

describe("find one user", () => {
  it("should fetch user successfully", async () => {
    // 1. On crée des mocks
    const req = { params: { id: "1" } } as unknown as Request; // On simule la requête
    const res = {
      json: jest.fn(), // On simule la fonction .json()
      status: jest.fn().mockReturnThis(), // Pour pouvoir chainer .status(200).json()
    } as unknown as Response;

    // 2. On appelle la fonction avec les mocks
    await getOneUser(req, res);

    // 3. On vérifie que res.json a été appelé avec les bonnes données
    expect(res.json).toHaveBeenCalled();

    //  Vérifier le contenu envoyé à res.json() :
    const data = (res.json as jest.Mock).mock.calls[0][0];
    expect(data).toBeDefined();
  });
});
describe("create new user", () => {
  it("should add a new user successfully", async () => {
    // 1. On crée des mocks
    const req = {
      body: { username: "test", email: "test@test.com", password: "123" },
    } as Request; // On simule la requête
    const res = {
      json: jest.fn(), // On simule la fonction .json()
      status: jest.fn().mockReturnThis(), // Pour pouvoir chainer .status(200).json()
    } as unknown as Response;

    // 2. On appelle la fonction avec les mocks
    await createUsers(req, res);

    // 3. On vérifie que res.json a été appelé avec les bonnes données
    expect(res.json).toHaveBeenCalled();

    // Vérifier le contenu envoyé à res.json() :
    const data = (res.json as jest.Mock).mock.calls[0][0];
    expect(data).toBeDefined();
  });
});

// Arrêt des tests
afterAll(async () => {
  await pool.end();
});
