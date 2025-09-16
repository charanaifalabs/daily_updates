import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema: Schema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
