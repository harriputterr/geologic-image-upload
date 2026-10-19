import type { NextFunction, Request, Response } from "express";

import { UploadImageUseCase } from "../../application/images/upload-image.use-case.ts";

type FileTags = {
  fileIndex: number;
  people: string[];
};

const parseTags = (value: unknown): FileTags[] => {
  if (typeof value !== "string") return [];

  const tags = JSON.parse(value);
  return Array.isArray(tags) ? tags : [];
};

export class ImageController {
  constructor(private readonly uploadImage: UploadImageUseCase) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          error: "At least one image file is required",
        });
      }

      const tags = parseTags(req.body.tags);

      const images = await Promise.all(
        req.files.map((file, index) =>
          this.uploadImage.execute({
            buffer: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            tags: {
              people:
                tags.find((tag) => tag.fileIndex === index)?.people ?? [],
            },
          }),
        ),
      );

      console.log(
        `Uploaded ${images.length} image${images.length === 1 ? "" : "s"}`,
        images.map((image) => ({
          id: image.id,
          name: image.originalName,
          people: image.tags.people,
        })),
      );

      return res.status(201).json({ data: images });
    } catch (error) {
      next(error);
    }
  };
}
