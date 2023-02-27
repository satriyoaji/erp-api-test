import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", controller.readMany);
router.get("/:id", controller.read);
router.post("/", controller.invite);
router.patch("/:id", controller.update);
router.delete("/:id", controller.destroy);

export default router;
