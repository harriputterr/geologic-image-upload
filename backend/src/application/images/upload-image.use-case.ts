import { MetadataExtractorPort } from "../../domain/images/metadata-extractor.port.ts";
import { ImageRepositoryPort } from "../../domain/images/image.repository.port.ts";
import { ImageStoragePort } from "../../domain/images/image.storage.port.ts";
import type { ImageTags } from "../../domain/images/image.ts";

type UploadImageInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  tags: ImageTags;
};

export class UploadImageUseCase {
  constructor(
    private readonly storage: ImageStoragePort,
    private readonly repository: ImageRepositoryPort,
    private readonly metadataExtractor: MetadataExtractorPort,
  ) {}

  async execute(input: UploadImageInput) {
    const metadata = await this.metadataExtractor.extract(input.buffer);

    const { url } = await this.storage.upload({
      buffer: input.buffer,
      mimeType: input.mimeType,
    });

    return this.repository.create({
      storageUrl: url,
      fileName: input.originalName,
      metadata,
      sizeBytes: input.sizeBytes,
      mimeType: input.mimeType,
      tags: input.tags,
    });
  }
}
