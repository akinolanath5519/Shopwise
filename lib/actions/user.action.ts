"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "@/db/prisma";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false, // 👈 disable auto-redirect
    });

    // Check if there's an error in response
    if (res?.error) {
      return {
        success: false,
        message: res.error || "Invalid email or password.",
      };
    }

    // Show success message, then handle redirection in client
    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Input validation using the schema
  const parsed = signUpFormSchema.safeParse(rawData);

  // If validation fails, return detailed error messages
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, confirmPassword } = parsed.data;

  // Check if passwords match
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  // Check if user already exists
  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use.",
      };
    }
  } catch (error) {
    console.error("Database error:", error); // Log the error for debugging purposes
    return {
      success: false,
      message:
        "There was an error checking user existence. Please try again later.",
    };
  }

  // Create user
  try {
    const hashedPassword = hashSync(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully!",
    };
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    return {
      success: false,
      message:
        "There was an error creating the account. Please try again later.",
    };
  }
}

//sign user out
export async function signOutUser() {
  await signOut();
}
