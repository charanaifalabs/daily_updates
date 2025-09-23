import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "admin" | "librarian" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  borrowedBooks: mongoose.Types.ObjectId[];
  purchasedBooks: mongoose.Types.ObjectId[];
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "librarian", "user"],
      default: "user",
    },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    borrowedBooks: [{ type: Schema.Types.ObjectId, ref: "Borrow" }],
    purchasedBooks: [{ type: Schema.Types.ObjectId, ref: "Purchase" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
