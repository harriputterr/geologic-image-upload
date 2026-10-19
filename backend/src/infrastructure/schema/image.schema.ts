import mongoose, { Schema } from "mongoose";

const imageMetadataSchema = new Schema(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    space: { type: String, required: true },
    hasAlpha: { type: Boolean, allowNull: false },
    orientation: { type: Number, allowNull: false },
  },
  { _id: false, timestamps: false },
);

const imageTagsSchema = new Schema(
  {
    people: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { _id: false, timestamps: false },
);

const imageSchema = new Schema({
  url: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  metadata: { type: imageMetadataSchema, required: true },
  tags: { type: imageTagsSchema, required: true },
});

imageSchema.index({ "tags.people": 1 });

export const ImageModel = mongoose.model("Image", imageSchema);
