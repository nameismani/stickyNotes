"use client";

import React, { useState, useEffect } from "react";
import Card from "../ui/Card";

import AuthTabs from "../ui/AuthTabs";
import AuthTab from "../ui/AuthTab";
import { useToast } from "@/context/ToastContext";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useAxios from "@/hooks/useAxios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  initialTab?: "login" | "register";
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const AuthForm: React.FC<AuthFormProps> = ({ initialTab = "login" }) => {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { post, error: registerError } = useAxios(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`
  );
  const { showToast } = useToast();
  const router = useRouter();

  // Reset all states when tab changes
  const handleTabChange = (newTab: "login" | "register") => {
    setTab(newTab);
    setFormData(initialFormData);
    setErrors({});
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the current field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];

      if (name === "password") {
        if (formData.confirmPassword) {
          if (value === formData.confirmPassword) {
            delete newErrors.confirmPassword;
          } else {
            newErrors.confirmPassword = "Passwords do not match";
          }
        }
      }

      if (name === "confirmPassword") {
        if (value === formData.password) {
          delete newErrors.confirmPassword;
        } else {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }

      return newErrors;
    });
  };

  const validateForm = (type: "login" | "register"): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (type === "login") {
      // Login validation
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      // Register validation
      if (!formData.username) {
        newErrors.username = "Username is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      "Forgot password functionality is currently under development.",
      "info"
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm("login")) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        showToast(result.error, "error", "top-right");
      } else {
        showToast("Successfully logged in!", "success", "top-right");
        router.push("/home"); // Redirect to protected home page
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast(
        error instanceof Error ? error.message : "Login failed",
        "error",
        "top-right"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm("register")) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await post({
        user_name: formData.username,
        user_email: formData.email,
        password: formData.password,
      });
      console.log(data, "asfddsafdfs");
      //   if (!response.ok) {
      //     throw new Error(data.message || "Registration failed");
      //   }

      showToast("Successfully registered! Please login.", "success");
      handleTabChange("login");
    } catch (error) {
      console.error("Registration error:", error);
      showToast(
        error instanceof Error ? error.message : "Registration failed",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = "Email is invalid";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        else delete newErrors.password;
        break;
      case "username":
        if (!value) newErrors.username = "Username is required";
        else delete newErrors.username;
        break;
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Please confirm your password";
        else if (value !== formData.password)
          newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return (
    <Card className="min-w-[340px]">
      <AuthTabs defaultTab={tab} onTabChange={handleTabChange}>
        <AuthTab tab="login" activeTab={tab}>
          <div className="pt-1">
            <form onSubmit={handleLogin} className="space-y-2">
              {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Welcome Back
              </h2> */}

              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.email}
              />

              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.password}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-orange-500 hover:underline transition-colors duration-200"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  className="transform transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  Login
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-orange-500 hover:underline transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("register");
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </AuthTab>

        <AuthTab tab="register" activeTab={tab}>
          <div className="pt-1">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Create Account
              </h2> */}

              <Input
                name="username"
                label="Username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.username}
              />

              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.email}
              />

              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.password}
              />

              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  //   className="transform transition hover:scale-[1.01] active:scale-[0.99]"
                  className="transform transition hover:scale-[1] active:scale-[0.99]"
                >
                  Register
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-orange-500 hover:underline transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("login");
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </AuthTab>
      </AuthTabs>
    </Card>
  );
};

export default AuthForm;
