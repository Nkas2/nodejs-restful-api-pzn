import supertest from "supertest";
import { prismaClient } from "../src/application/database.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
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
