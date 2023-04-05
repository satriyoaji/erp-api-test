import request from "supertest";
import { createApp } from "@src/app.js";

describe("list all coas", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create coa
    const response = await request(app).get("/v1/coas");
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toBe("Unauthorized Access");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to read coa
    const response = await request(app).get("/v1/coas").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.message).toBe("Forbidden Access");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      number: 10001,
      name: "coa A",
      category: "liquid assets",
      type: "assets",
      group: "",
      isLocked: false,
    };
    await request(app).post("/v1/coas").send(data).set("Authorization", `Bearer ${accessToken}`);
    const data2 = {
      number: 10001,
      name: "coa A",
      category: "liquid assets",
      type: "assets",
      group: "",
      isLocked: false,
    };
    await request(app).post("/v1/coas").send(data2).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app).get("/v1/coas").set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data[0]._id).not.toBeNull();
    expect(response.body.data[0].code).toEqual(data.code);
    expect(response.body.data[0].name).toEqual(data.name);
    expect(response.body.data[0].chartOfAccount).toEqual(data.chartOfAccount);
    expect(response.body.data[0].hasProductionNumber).toEqual(data.hasProductionNumber);
    expect(response.body.data[0].hasExpiryDate).toEqual(data.hasExpiryDate);
    expect(response.body.data[0].unit).toEqual(data.unit);
    expect(response.body.data[0].converter).toEqual(data.converter);
    expect(response.body.data[0].createdAt instanceof Date).toBeTruthy();
    expect(response.body.data[0].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.data[1]._id).not.toBeNull();
    expect(response.body.data[1].code).toEqual(data2.code);
    expect(response.body.data[1].name).toEqual(data2.name);
    expect(response.body.data[1].chartOfAccount).toEqual(data2.chartOfAccount);
    expect(response.body.data[1].hasProductionNumber).toEqual(data2.hasProductionNumber);
    expect(response.body.data[1].hasExpiryDate).toEqual(data2.hasExpiryDate);
    expect(response.body.data[1].unit).toEqual(data2.unit);
    expect(response.body.data[1].converter).toEqual(data2.converter);
    expect(response.body.data[1].createdAt instanceof Date).toBeTruthy();
    expect(response.body.data[1].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(1);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(2);
  });
});

describe("read coa", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create coa
    const response = await request(app).get("/v1/coas");
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toBe("Unauthorized Access");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to read coa
    const response = await request(app).get("/v1/coas").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.message).toBe("Forbidden Access");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      code: "A1",
      name: "coa A",
      chartOfAccount: "Goods",
      hasProductionNumber: true,
      hasExpiryDate: false,
      unit: "pcs",
      converter: [
        {
          name: "dozen",
          multiply: 12,
        },
      ],
    };
    const responseCreate = await request(app).post("/v1/coas").send(data).set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app)
      .get("/v1/coas/" + responseCreate.body._id)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data._id).not.toBeNull();
    expect(response.body.data.code).toEqual(data.code);
    expect(response.body.data.name).toEqual(data.name);
    expect(response.body.data.chartOfAccount).toEqual(data.chartOfAccount);
    expect(response.body.data.hasProductionNumber).toEqual(data.hasProductionNumber);
    expect(response.body.data.hasExpiryDate).toEqual(data.hasExpiryDate);
    expect(response.body.data.unit).toEqual(data.unit);
    expect(response.body.data.converter).toEqual(data.converter);
    expect(response.body.data.createdAt instanceof Date).toBeTruthy();
    expect(response.body.data.createdBy_id).toBe(authResponse.body._id);
  });
});
