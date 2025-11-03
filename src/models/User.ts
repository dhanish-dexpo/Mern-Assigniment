import { Schema, model, models } from "mongoose";

export interface IUser {
  name?: string | null;
  email: string;
  role?: "hr" | "user";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["hr", "user"], default: "user" },
  },
  { timestamps: true }
);

export const UserModel = models.User || model<IUser>("User", UserSchema);
