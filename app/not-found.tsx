"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // For navigation
import { APP_NAME } from "@/lib/constant/index"; // Import APP_NAME from utils file

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 px-4">
      <Image src="/images/logo.svg" alt="" width={50} height={50} priority />

      <h1 className="text-2xl font-semibold">Page not found in - {APP_NAME}</h1>

      <Link href="/">
        <Button variant="default">Go back home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
