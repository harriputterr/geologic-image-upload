import assert from "node:assert/strict";
import test from "node:test";

import { UploadImageUseCase } from "../src/application/images/upload-image.use-case.ts";
import type {
  CreateImageInput,
  ImageRepositoryPort,
} from "../src/domain/images/image.repository.port.ts";
import type {
  ImageStoragePort,
  ImageStorageUploadInput,
} from "../src/domain/images/image.storage.port.ts";
import type {
  Image,
  ImageMetadata,
  ImageTags,
} from "../src/domain/images/image.ts";
import type { MetadataExtractorPort } from "../src/domain/images/metadata-extractor.port.ts";

const metadata: ImageMetadata = {
  width: 1200,
  height: 800,
  format: "jpeg",
  space: "srgb",
  hasAlpha: false,
};

const tags: ImageTags = {
  people: ["Alex Morgan", "Maya Patel"],
};

const input = {
  buffer: Buffer.from("image-bytes"),
  originalName: "mountain.jpg",
  mimeType: "image/jpeg",
  sizeBytes: 11,
  tags,
};

test("uploads an image and persists its metadata", async () => {
  let storageInput: ImageStorageUploadInput | undefined;
  let repositoryInput: CreateImageInput | undefined;

  const storage: ImageStoragePort = {
    async upload(receivedInput) {
      storageInput = receivedInput;
      return { url: "http://storage/images/image-id" };
    },
  };

  const expectedImage: Image = {
    id: "image-id",
    originalName: input.originalName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    metadata,
    tags: input.tags,
  };

  const repository: ImageRepositoryPort = {
    async create(receivedInput) {
      repositoryInput = receivedInput;
      return expectedImage;
    },
  };

  const metadataExtractor: MetadataExtractorPort = {
    async extract(buffer) {
      assert.strictEqual(buffer, input.buffer);
      return metadata;
    },
  };

  const useCase = new UploadImageUseCase(
    storage,
    repository,
    metadataExtractor,
  );

  const result = await useCase.execute(input);

  assert.deepEqual(storageInput, {
    buffer: input.buffer,
    mimeType: input.mimeType,
  });
  assert.deepEqual(repositoryInput, {
    storageUrl: "http://storage/images/image-id",
    fileName: input.originalName,
    metadata,
    sizeBytes: input.sizeBytes,
    mimeType: input.mimeType,
    tags: input.tags,
  });
  assert.strictEqual(result, expectedImage);
});

test("does not persist an image when storage fails", async () => {
  let repositoryCalled = false;

  const storage: ImageStoragePort = {
    async upload() {
      throw new Error("upload failed");
    },
  };

  const repository: ImageRepositoryPort = {
    async create() {
      repositoryCalled = true;
      throw new Error("repository should not be called");
    },
  };

  const metadataExtractor: MetadataExtractorPort = {
    async extract() {
      return metadata;
    },
  };

  const useCase = new UploadImageUseCase(
    storage,
    repository,
    metadataExtractor,
  );

  await assert.rejects(() => useCase.execute(input), /upload failed/);
  assert.equal(repositoryCalled, false);
});
