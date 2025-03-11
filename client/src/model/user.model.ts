import mongoose, { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface UserTypes extends Document {
  user_id: string;
  user_name: string;
  user_email: string;
  password: string;
  last_update: number;
  create_on: number;
}

const UserSchema = new Schema<UserTypes>(
  {
    user_id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    password: { type: String, required: true },
    last_update: {
      type: Number,
      default: Date.now(),
    },
    create_on: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    strict: false,
  }
);

UserSchema.pre("save", function (next) {
  this.last_update = Date.now();
  next();
});

export const UserModel =
  mongoose.models.users || model<UserTypes>("users", UserSchema);
