import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createUser, removeAllTestContact, removeUser } from "./test-util.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createUser();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUser();
  });

  it("should can create contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "nayandra",
        last_name: "kastoro",
        email: "kastoronayandra@gmail.com",
        phone: "085156202991",
      });
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("nayandra");
    expect(result.body.data.last_name).toBe("kastoro");
    expect(result.body.data.email).toBe("kastoronayandra@gmail.com");
    expect(result.body.data.phone).toBe("085156202991");
  });

  it("should reject if token is not valid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "dawd")
      .send({
        first_name: "nayandra",
        last_name: "kastoro",
        email: "kastoronayandra@gmail.com",
        phone: "085156202991",
      });
    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if first name is not exist", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "kastoro",
        email: "kastoronayandra@gmail.com",
        phone: "085156202991",
      });
    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should can create contact without lastname, email and phone", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "nayandra",
      });
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});
