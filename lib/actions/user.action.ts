"use server";

import { signInFormSchema } from "../validators";
import { signIn,signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

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


//sign user out
export async function signOutUser() {
    await signOut();
}