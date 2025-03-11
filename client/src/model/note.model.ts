import mongoose, { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface UserTypes extends Document {
  note_id: string;
  user_id: string;
  note_title: string;
  note_content: string;
  color: string;
  last_update: number;
  create_on: number;
}

const UserSchema = new Schema<UserTypes>(
  {
    note_id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    user_id: {
      type: String,
      required: true,
    },
    note_title: { type: String, required: true },
    note_content: { type: String, required: true },
    color: { type: String, required: true },
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
  mongoose.models.User || model<UserTypes>("User", UserSchema);
