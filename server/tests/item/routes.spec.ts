// Import the supertest library for making HTTP requests
import supertest from "supertest";

// Import the Express application
import app from "../../src/app";

// Import databaseClient
import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";

// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/items route
describe("GET /api/items", () => {
  it("should fetch items successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/items endpoint
    const response = await supertest(app).get("/api/items");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
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

// Test suite for the POST /api/items route
// Doesn't pass: maybe something to change in app config :/
describe("POST /api/items", () => {
  it("should add a new item successfully", async () => {
    // Mock result of the database query
    const result = { insertId: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data
    const fakeItem = { title: "foo", user_id: 0 };

    // Send a POST request to the /api/items endpoint with a test item
    const response = await supertest(app).post("/api/items").send(fakeItem);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.insertId).toBe(result.insertId);
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { insertId: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data with missing user_id
    const fakeItem = { title: "foo" };

    // Send a POST request to the /api/items endpoint with a test item
    const response = await supertest(app).post("/api/items").send(fakeItem);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({});
  });
});

// Test suite for the PUT /api/items/:id route
// This route is not yet implemented :/
describe("PUT /api/items/:id", () => {
  it("should update an existing item successfully", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data
    const fakeItem = { title: "foo", user_id: 0 };

    // Send a PUT request to the /api/items/:id endpoint with a test item
    const response = await supertest(app).put("/api/items/42").send(fakeItem);

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data with missing user_id
    const fakeItem = { title: "foo" };

    // Send a PUT request to the /api/items/:id endpoint with a test item
    const response = await supertest(app).put("/api/items/42").send(fakeItem);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake item data with missing user_id
    const fakeItem = { title: "foo", user_id: 0 };

    // Send a PUT request to the /api/items/:id endpoint with a test item
    const response = await supertest(app).put("/api/items/43").send(fakeItem);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the DELETE /api/items/:id route
// This route is not yet implemented :/
describe("DELETE /api/items/:id", () => {
  it("should delete an existing item successfully", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/items/:id endpoint
    const response = await supertest(app).delete("/api/items/42");

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/items/:id endpoint
    const response = await supertest(app).delete("/api/items/43");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});
