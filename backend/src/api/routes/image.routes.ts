import { Router } from "express";
import multer from "multer";

import { ImageController } from "../controllers/image.controller.ts";

export function createImageRouter(controller: ImageController) {
  const router = Router();

  const upload = multer({
    storage: multer.memoryStorage(),
  });

  router.post("/upload", upload.array("image"), controller.upload);

  return router;
}


