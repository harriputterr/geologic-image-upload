import { ImageController } from "./api/controllers/image.controller.ts";
import { createImageRouter } from "./api/routes/image.routes.ts";
import { UploadImageUseCase } from "./application/images/upload-image.use-case.ts";
import { ImageRepositoryAdapter } from "./infrastructure/images/image.repository.adapter.ts";
import { ImageStorageAdapter } from "./infrastructure/images/image.storage.adapter.ts";
import { MetadataExtractorAdapter } from "./infrastructure/images/metadata-extractor.adapter.ts";
import { ImageModel } from "./infrastructure/schema/image.schema.ts";
import { s3Client } from "./lib/s3Client.ts";

const repository = new ImageRepositoryAdapter(ImageModel);
const storage = new ImageStorageAdapter(
  s3Client,
  process.env.AWS_ENDPOINT_URL as string,
  process.env.IMAGE_UPLOAD_BUCKET_NAME as string,
);

const metadataExtractor = new MetadataExtractorAdapter();

const uploadImage = new UploadImageUseCase(
  storage,
  repository,
  metadataExtractor,
);

const imageController = new ImageController(uploadImage);

export const imageRouter = createImageRouter(imageController);
