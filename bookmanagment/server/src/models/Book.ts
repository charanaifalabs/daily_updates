import mongoose, { Schema, Document } from "mongoose";

export type BookStatus = "available" | "borrowed" | "sold";

export interface IBook extends Document {
  title: string;
  author: string;
  description?: string;
  publishedYear?: number;
  createdBy: mongoose.Types.ObjectId;
  status: BookStatus;
  price?: number;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    publishedYear: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["available", "borrowed", "sold"],
      default: "available",
    },
    price: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", bookSchema);
