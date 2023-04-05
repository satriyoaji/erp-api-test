import request from "supertest";
import { createApp } from "@src/app.js";

describe("delete coa", () => {
  let _id = "";
  beforeEach(async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).patch("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create coa
    const data = {
      number: 10001,
      name: "coa A",
      category: "liquid assets",
      type: "assets",
      group: "",
      isLocked: false,
    };
    const response = await request(app).post("/v1/coas").send(data).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create coa
    const response = await request(app).delete("/v1/coas/" + _id);
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
    const response = await request(app)
      .delete("/v1/coas/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);

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
    const responseDelete = await request(app)
      .delete("/v1/coas/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(responseDelete.statusCode).toEqual(204);

    const response = await request(app).get("/v1/coas").set("Authorization", `Bearer ${accessToken}`);
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
