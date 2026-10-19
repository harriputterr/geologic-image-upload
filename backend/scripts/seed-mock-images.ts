import mongoose from "mongoose";

import { ImageModel } from "../src/infrastructure/schema/image.schema.ts";

const RECORD_COUNT = 10_000;
const TEST_MONGO_URI =
  process.env.MONGO_TEST_URI ??
  "mongodb://127.0.0.1:27017/image-upload-test-db";

const PEOPLE = [
  "Alex Morgan",
  "Jordan Lee",
  "Maya Patel",
  "Sofia Garcia",
  "Daniel Kim",
];

const FORMATS = [
  { extension: "jpg", format: "jpeg", mimeType: "image/jpeg" },
  { extension: "png", format: "png", mimeType: "image/png" },
  { extension: "webp", format: "webp", mimeType: "image/webp" },
];

function peopleForRecord(index: number): string[] {
  const numberOfPeople = (index % 3) + 1;

  return Array.from(
    { length: numberOfPeople },
    (_, offset) => PEOPLE[(index + offset) % PEOPLE.length],
  );
}

async function seedMockImages() {
  await mongoose.connect(TEST_MONGO_URI);

  const databaseName = mongoose.connection.db?.databaseName;
  if (!databaseName?.toLowerCase().includes("test")) {
    throw new Error(
      `Refusing to seed non-test database "${databaseName ?? "unknown"}"`,
    );
  }

  const MockImageModel = mongoose.model(
    "MockImage",
    ImageModel.schema,
    "mockImages",
  );

  await MockImageModel.init();
  await MockImageModel.deleteMany({});

  const documents = Array.from({ length: RECORD_COUNT }, (_, index) => {
    const imageNumber = index + 1;
    const imageFormat = FORMATS[index % FORMATS.length];

    return {
      url: `https://mock-s3.example.com/images/mock-image-${imageNumber}.${imageFormat.extension}`,
      fileName: `mock-image-${imageNumber}.${imageFormat.extension}`,
      mimeType: imageFormat.mimeType,
      sizeBytes: 50_000 + ((index * 7_919) % 4_950_000),
      metadata: {
        width: 640 + ((index % 8) * 160),
        height: 480 + ((index % 6) * 120),
        format: imageFormat.format,
        space: "srgb",
        hasAlpha: imageFormat.format === "png",
        orientation: [1, 3, 6, 8][index % 4],
      },
      tags: {
        people: peopleForRecord(index),
      },
    };
  });

  await MockImageModel.insertMany(documents);

  const count = await MockImageModel.countDocuments();
  console.log(
    `Seeded ${count} records into ${databaseName}.mockImages`,
  );
}

try {
  await seedMockImages();
} catch (error) {
  console.error("Failed to seed mock images:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
