import { convertToPlainObject } from "@/lib/constant/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constant/index";
import { PrismaClient, Product } from "@prisma/client";

// Convert Decimal to number in product data
function convertProductFields(product: Product) {
  return {
    ...product,
    price: parseFloat(product.price.toString()), // Convert Decimal to number
    rating: parseFloat(product.rating.toString()), // Convert Decimal to number
  };
}

//get latest products from database
export async function getLatestProducts() {
  const Prisma = new PrismaClient();

  const data = await Prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  // Map the products to ensure Decimal fields are converted to the correct types
  const convertedData = data.map(convertProductFields);

  // If you're using convertToPlainObject, you can call it after conversion
  return convertToPlainObject(convertedData);
}




//Get single products by its slug from database

const prisma = new PrismaClient(); 

export async function getProductBySlug(slug: string) {
  try {
    // Fetch product by slug
    const product = await prisma.product.findFirst({
      where: { slug },
    });

    return product || null; // Return product data or null if not found
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Return null in case of an error
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after request
  }
}
