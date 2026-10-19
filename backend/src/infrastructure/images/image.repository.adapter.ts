import {
  CreateImageInput,
  ImageRepositoryPort,
} from "../../domain/images/image.repository.port.ts";
import type { ImageModel } from "../schema/image.schema.ts";
import { Image } from "../../domain/images/image.ts";

class ImageRepositoryAdapter implements ImageRepositoryPort {
  constructor(private readonly model: typeof ImageModel) {}

  async create(input: CreateImageInput): Promise<Image> {
    const document = await this.model.create({
      url: input.storageUrl,
      fileName: input.fileName,
      sizeBytes: input.sizeBytes,
      metadata: input.metadata,
      mimeType: input.mimeType,
      tags: input.tags,
    });

    return {
      id: document._id.toString(),
      originalName: document.fileName,
      sizeBytes: document.sizeBytes,
      metadata: document.metadata,
      mimeType: document.mimeType,
      tags: document.tags,
    };
  }
}

export { ImageRepositoryAdapter };
