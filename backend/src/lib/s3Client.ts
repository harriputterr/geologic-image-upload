import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test", // floci accepts any fake text
    secretAccessKey: "test",
  },
});

export { s3Client, S3Client };
