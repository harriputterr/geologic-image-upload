import { ImageMetadata } from "./image.ts";

export interface MetadataExtractorPort {
  extract(buffer: Buffer): Promise<ImageMetadata>;
}
