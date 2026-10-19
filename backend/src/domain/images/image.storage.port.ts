export type ImageUploadResult = {
  url: string;
};

export type ImageStorageUploadInput = {
  buffer: Buffer;
  mimeType: string;
};

export interface ImageStoragePort {
  upload: (input: ImageStorageUploadInput) => Promise<ImageUploadResult>;
}
