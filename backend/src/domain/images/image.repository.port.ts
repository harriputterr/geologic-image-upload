import type { Image, ImageMetadata, ImageTags } from "./image.ts";

export type CreateImageInput = {
  storageUrl: string;
  sizeBytes: number;
  fileName: string;
  metadata: ImageMetadata;
  mimeType: string;
  tags: ImageTags;
};

export interface ImageRepositoryPort {
  create(input: CreateImageInput): Promise<Image>;
}
