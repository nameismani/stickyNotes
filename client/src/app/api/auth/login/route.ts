import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnection } from "../../../../port/db.connection";
import { UserModel } from "@/model/user.model";

dbConnection();

const JWT_SECRET = process.env.SECRET_KEY || "secret-key";
const ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24; // 1 day

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ user_email: email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}m`,
    });

    const userResponse = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      create_on: user.create_on,
      last_update: user.last_update,
    };

    return NextResponse.json({
      access_token: accessToken,
      token_type: "bearer",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
