import mongoose, { Schema, Document } from "mongoose";

export interface IPurchase extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  purchasedAt: Date;
  price: String;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    purchasedAt: { type: Date, default: Date.now },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>("Purchase", purchaseSchema);
