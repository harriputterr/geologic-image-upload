import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  ImageStoragePort,
  ImageStorageUploadInput,
  ImageUploadResult,
} from "../../domain/images/image.storage.port.ts";
import { S3Client } from "../../lib/s3Client.ts";

class ImageStorageAdapter implements ImageStoragePort {
  constructor(
    private readonly client: S3Client,
    private readonly endpoint: string,
    private readonly bucket: string,
  ) {}

  async upload(input: ImageStorageUploadInput): Promise<ImageUploadResult> {
    const key = crypto.randomUUID();

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: input.buffer,
          ContentType: input.mimeType,
        }),
      );
    } catch (error: any) {
      throw new Error("Failed to upload image", error);
    }

    return {
      url: `${this.endpoint}/${this.bucket}/${key}`,
    };
  }
}

export { ImageStorageAdapter };
