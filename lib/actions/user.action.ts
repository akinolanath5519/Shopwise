"use server";

import { signInFormSchema, signUpFormSchema,shippingAddressSchema,paymentMethodSchema } from "../validators";
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import {formatError} from '@/lib/constant/utils'
import { ShippingAddress } from '@/types';
import { z } from 'zod';


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


//Get User By Id
export async function getUserById(userId:string){
  const user =await prisma.user.findFirst({
where:{id:userId}
})
if(!user) throw new Error('User not found');
 return user;
}


// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}



// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}