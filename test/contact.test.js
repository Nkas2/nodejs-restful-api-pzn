import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import {
  createManyTestContacts,
  createTestContact,
  createUser,
  getTestContact,
  removeAllTestContact,
  removeUser,
} from "./test-util.js";

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
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});

describe("GET /api/contacts/:id", () => {
  beforeEach(async () => {
    await createUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUser();
  });

  it("should can get contact", async () => {
    const test = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${test.id}`)
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(test.id);
    expect(result.body.data.first_name).toBe(test.first_name);
    expect(result.body.data.last_name).toBe(test.last_name);
    expect(result.body.data.phone).toBe(test.phone);
    expect(result.body.data.email).toBe(test.email);
  });

  it("should rreturn 404 if contact id is not found", async () => {
    const test = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${test.id + 1}`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id not valid", async () => {
    const test = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${-1}`)
      .set("Authorization", "test");
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id not number", async () => {
    const test = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/nayandra`)
      .set("Authorization", "test");
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUser();
  });

  it("should can update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "Eko",
        last_name: "Khannedy",
        email: "eko@pzn.com",
        phone: "09999999",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("Eko");
    expect(result.body.data.last_name).toBe("Khannedy");
    expect(result.body.data.email).toBe("eko@pzn.com");
    expect(result.body.data.phone).toBe("09999999");
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "eko",
        phone: "",
      });

    expect(result.status).toBe(400);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test")
      .send({
        first_name: "Eko",
        last_name: "Khannedy",
        email: "eko@pzn.com",
        phone: "09999999",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:id", () => {
  beforeEach(async () => {
    await createUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUser();
  });

  it("should can remove contacts", async () => {
    const user = await getTestContact();
    const result = await supertest(web)
      .delete(`/api/contacts/${user.id}`)
      .set("Authorization", "test");

    // logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("should reject if id is invalid", async () => {
    const user = await getTestContact();
    const result = await supertest(web)
      .delete(`/api/contacts/${user.id + 1}`)
      .set("Authorization", "test");

    // logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is negative", async () => {
    const user = await getTestContact();
    const result = await supertest(web)
      .delete(`/api/contacts/-4`)
      .set("Authorization", "test");

    // logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET api/contacts", () => {
  beforeEach(async () => {
    await createUser();
    await createManyTestContacts();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    // console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "test 1",
      })
      .set("Authorization", "test");

    // console.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    // console.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search using phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "0809000001",
      })
      .set("Authorization", "test");

    // console.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
