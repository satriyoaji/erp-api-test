import request from "supertest";
import { createApp } from "@src/app.js";

describe("restore item", () => {
  let _id = "";
  beforeAll(async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      code: "F1",
      name: "item F1",
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
    const response = await request(app).post("/v1/items").send(data).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app).patch("/v1/items/" + _id + "/restore");
    expect(response.statusCode).toEqual(401);
    // expect(response.body.code).toEqual(401);
    // expect(response.body.status).toBe("Unauthorized");
    // expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to read item
    const response = await request(app)
        .patch("/v1/items/" + _id + "/restore")
        .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    // expect(response.body.code).toEqual(403);
    // expect(response.body.status).toBe("Forbidden");
    // expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should delete data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;
    const responseDelete = await request(app)
        .patch("/v1/items/" + _id + "/restore")
        .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(responseDelete.statusCode).toEqual(204);

    const response = await request(app)
        .get("/v1/items/" + _id)
        .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data.isArchived).toBe(false);
  });
});