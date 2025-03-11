import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnection } from "@/port/db.connection";
import { UserModel } from "@/model/user.model";

dbConnection();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_name, user_email, password } = body;

    if (!user_name || !user_email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ user_email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const newUser = new UserModel({
      user_name,
      user_email,
      password: hashedPassword,
      create_on: currentTimestamp,
      last_update: currentTimestamp,
    });

    await newUser.save();

    const userResponse = {
      user_id: newUser.user_id,
      user_name: newUser.user_name,
      user_email: newUser.user_email,
      create_on: newUser.create_on,
      last_update: newUser.last_update,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Could not create user" },
      { status: 500 }
    );
  }
}
