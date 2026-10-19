import sharp from "sharp";

import type { MetadataExtractorPort } from "../../domain/images/metadata-extractor.port.ts";
import type { ImageMetadata } from "../../domain/images/image.ts";

class MetadataExtractorAdapter implements MetadataExtractorPort {
  async extract(buffer: Buffer): Promise<ImageMetadata> {
    const metadata = await sharp(buffer).metadata();

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
    };
  }
}

export { MetadataExtractorAdapter };