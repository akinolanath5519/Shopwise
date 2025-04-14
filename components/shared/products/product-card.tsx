import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { cn } from '@/lib/constant/utils';
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  // 💰 Formats and styles product price into dollars and cents
  const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
    const numericValue = typeof value === 'number' ? value : Number(value);
    const stringValue = numericValue.toFixed(2);
    const [intValue, floatValue] = stringValue.split('.');

    return (
      <p className={cn('text-2xl', className)}>
        <span className="text-xs align-super">$</span>
        {intValue}
        <span className="text-xs align-super">.{floatValue}</span>
      </p>
    );
  };

  // ⭐ Renders filled and empty stars based on product.rating
  const renderStars = (rating: number = 0) => {
    const filledStars = Math.floor(rating);
    const totalStars = 5;
    return (
      <div className="text-yellow-500 text-sm mb-1">
        {Array.from({ length: totalStars }).map((_, i) => (
          <span key={i}>
            {i < filledStars ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    // 🔗 Use slug for cleaner SEO-friendly URLs
    <Link href={`/product/${product.slug}`}>
      <Card className="hover:shadow-lg transition duration-300">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
            {product.image ? (
              <Image
                src={Array.isArray(product.image) ? product.image[0] : product.image}
                alt={product.name || "Product image"}
                width={300}
                height={192}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>

          {/* ⭐ Star Rating */}
          {renderStars(product.rating)}

          {/* 📄 Short description */}
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* 💰 Price */}
          <ProductPrice value={Number(product.price)} className="font-semibold text-green-700" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
