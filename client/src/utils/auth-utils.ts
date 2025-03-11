import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { dbConnection } from "../port/db.connection";

const JWT_SECRET = process.env.SECRET_KEY || "your-secret-key";

interface DecodedToken {
  user_id: string;
}

export async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid authorization token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    await dbConnection();

    const db = mongoose.connection.db;
    const user = await db
      ?.collection("users")
      .findOne({ user_id: decoded.user_id });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: decoded.user_id,
      user: user,
    };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
