import request from "supertest";
import { createApp } from "@src/app.js";

describe("list all pricelists", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app).get("/v1/pricelists");
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
    // send request to read pricelist
    const response = await request(app).get("/v1/pricelists").set("Authorization", `Bearer ${accessToken}`);

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
      name: "Group A",
    };
    await request(app).post("/v1/pricelists").send(data).set("Authorization", `Bearer ${accessToken}`);
    const data2 = {
      name: "Group B",
    };
    await request(app).post("/v1/pricelists").send(data2).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app).get("/v1/pricelists").set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data[0]._id).not.toBeNull();
    expect(response.body.data[0].name).toEqual(data.name);
    expect(response.body.data[0].createdAt instanceof Date).toBeTruthy();
    expect(response.body.data[0].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.data[1]._id).not.toBeNull();
    expect(response.body.data[1].name).toEqual(data2.name);
    expect(response.body.data[1].createdAt instanceof Date).toBeTruthy();
    expect(response.body.data[1].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(1);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(2);
  });
});

describe("read pricelist", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app).get("/v1/pricelists");
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
    // send request to read pricelist
    const response = await request(app).get("/v1/pricelists").set("Authorization", `Bearer ${accessToken}`);

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
      name: "Group A",
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
    const responseCreate = await request(app)
      .post("/v1/pricelists")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app)
      .get("/v1/pricelists/" + responseCreate.body._id)
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
