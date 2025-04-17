"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import {formatError} from '@/lib/constant/utils'


//Sign in User
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
      redirect: false,
    });

    if (res?.error) {
      return {
        success: false,
        message: res.error || "Invalid email or password.",
      };
    }

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: formatError(error), 
    };
  }
}



//Sign Up User
export async function signUpUser(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signUpFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error), // 👈 Use formatError here
    };
  }

  try {
    const hashedPassword = hashSync(password, 10);

    await prisma.user.create({
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
    return {
      success: false,
      message: formatError(error), // 👈 Use formatError here
    };
  }
}


//sign user out
export async function signOutUser() {
  await signOut();
}
