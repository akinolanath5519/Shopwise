import { z } from "zod";
import { formatNumberWithDecimal } from "./constant/utils";

const currency = z.string().refine(
  (value) => {
    const num = Number(value);
    return !isNaN(num) && /^\d+(\.\d{2})$/.test(formatNumberWithDecimal(num));
  },
  {
    message: "Price must be a valid number with exactly 2 decimal places",
  }
);

const formattedSlug = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Slug must be lowercase and can only contain letters, numbers, and hyphens",
  });


  

// 🛒 Schema for inserting a product
export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  slug: formattedSlug,

  description: z.string().min(1, "Description is required"),
  price: currency,

  image: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
  rating: z.number().min(0).max(5).optional(),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
  brand: z.string().min(1, "Brand is required"),
  isFeatured: z.boolean().default(false),
  banner: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});
