"use server";

import { cookies } from "next/headers";
import { SignInFormData, SignUpFormData } from "@/types/auth";
import { redirect } from "next/navigation";
import Joi from "joi";

// Validation schemas
const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const signUpSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "string.min": "Username must be at least 3 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Confirm password is required",
  }),
});

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const data: SignInFormData = { email, password };

  // Validate form data
  const { error } = signInSchema.validate(data);
  if (error) {
    return { error: error.details[0].message };
  }

  try {
    // Call your API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "An error occurred during sign in" };
    }

    // Set authentication cookie
    cookies().set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/"); // Redirect to home page
  } catch (error) {
    return { error: "Failed to connect to server" };
  }
}

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const data: SignUpFormData = { username, email, password, confirmPassword };

  // Validate form data
  const { error } = signUpSchema.validate(data);
  if (error) {
    return { error: error.details[0].message };
  }

  try {
    // Call your API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "An error occurred during sign up" };
    }

    // Redirect to sign in page after successful registration
    redirect("/auth?tab=signin");
  } catch (error) {
    return { error: "Failed to connect to server" };
  }
}
