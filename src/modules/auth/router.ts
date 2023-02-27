import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.post("/signin", controller.signin);
router.post("/verify-token", controller.verifyToken);
router.get("/google-drive", controller.googleDrive);
router.get("/google/get-auth-url", controller.googleGetAuthUrl);
router.get("/google/oauth-callback", controller.googleOauthCallback);
router.get("/google-drive/get-auth-url", controller.googleDriveGetAuthUrl);
router.post("/exchange-token", controller.exchangeToken);

export default router;
