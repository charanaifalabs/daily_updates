import mongoose, { Schema, Document } from "mongoose";

export interface IBorrow extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  borrowedAt: Date;
  returnedAt?: Date;
  status: "borrowed" | "returned";
}

const borrowSchema = new Schema<IBorrow>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    borrowedAt: { type: Date, default: Date.now },
    returnedAt: Date,
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrow>("Borrow", borrowSchema);
