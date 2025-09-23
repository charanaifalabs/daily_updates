import mongoose, { Schema, Document } from "mongoose";

export interface IBookRequest extends Document {
  title: string;
  author: string;
  description?: string;
  publishedYear?: number;
  price?: number;
  requestedBy: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  action: "create" | "update" | "delete";
  bookId?: mongoose.Types.ObjectId;
}

const bookRequestSchema = new Schema<IBookRequest>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    publishedYear: { type: Number },
    price: { type: Number },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    action: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    bookId: { type: Schema.Types.ObjectId, ref: "Book" },
  },
  { timestamps: true }
);

export default mongoose.model<IBookRequest>("BookRequest", bookRequestSchema);
