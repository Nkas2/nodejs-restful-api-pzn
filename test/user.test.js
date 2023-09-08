import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createUser, removeUser } from "./test-util.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
    // console.log(result);
    console.log(result.body);
    console.log(result.body.data);
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();

    console.log(result.body);
  });

  it("should reject if user already regstered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createUser();
  });

  afterEach(async () => {
    await removeUser();
  });

  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia",
    });

    // logger.info(result.body);
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject if invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    // logger.info(result.body);
    console.log(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "naruto",
      password: "rahasia",
    });

    // logger.info(result.body);
    console.log(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if passwor is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia123",
    });

    // logger.info(result.body);
    console.log(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
