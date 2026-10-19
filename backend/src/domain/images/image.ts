export interface ImageTags {
  people: string[];
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  space: string;
  hasAlpha?: boolean;
  orientation?: number;
}

export interface Image {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  metadata: ImageMetadata;
  tags: ImageTags;
}
