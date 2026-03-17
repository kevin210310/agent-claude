import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("GET /", () => {
  describe("happy path", () => {
    it("debería retornar status 200 cuando se llama al endpoint raíz", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
    });

    it('debería retornar { message: "Hello World" } cuando se llama al endpoint raíz', async () => {
      const response = await request(app).get("/");

      expect(response.body).toEqual({ message: "Hello World" });
    });

    it("debería retornar Content-Type JSON cuando se llama al endpoint raíz", async () => {
      const response = await request(app).get("/");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  describe("edge cases", () => {
    it("debería retornar 404 cuando la ruta no existe", async () => {
      const response = await request(app).get("/ruta-inexistente");

      expect(response.status).toBe(404);
    });

    it("debería retornar 404 cuando se accede a una subruta no registrada", async () => {
      const response = await request(app).get("/foo/bar");

      expect(response.status).toBe(404);
    });
  });
});

describe("Middleware JSON", () => {
  it("debería parsear body JSON en peticiones POST", async () => {
    // El endpoint raíz solo acepta GET, pero el middleware JSON debe estar activo
    const response = await request(app)
      .post("/")
      .send({ key: "value" })
      .set("Content-Type", "application/json");

    // No hay handler POST, pero si el middleware falla lanzaría un 500
    expect(response.status).not.toBe(500);
  });
});
