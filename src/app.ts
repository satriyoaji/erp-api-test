import express, { static as ExpressStatic, Express } from "express";
import Middleware from "@src/middleware/index.js";
import router from "@src/router.js";

export async function createApp() {
  const app: Express = express();

  const middleware = new Middleware(app);
  middleware.registerBeforeRoutes();

  app.use("/assets", ExpressStatic("src/assets"));
  app.use("/v1", router());

  middleware.registerAfterRoutes();

  return app;
}
