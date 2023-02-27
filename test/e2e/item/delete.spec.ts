import request from "supertest";
import { createApp } from "@src/app.js";

describe("delete item", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app).get("/v1/items");
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
    // send request to read item
    const response = await request(app).get("/v1/items").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.message).toBe("Forbidden Access");
  });
  it("should delete data from database", async () => {
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
      name: "item A",
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
      .post("/v1/items")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    const responseDelete = await request(app)
      .delete("/v1/items")
      .send({
        _id: responseCreate.body._id,
      })
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(responseDelete.statusCode).toEqual(204);

    const response = await request(app).get("/v1/items").set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data.length).toBe(0);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(0);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(0);
  });
});
