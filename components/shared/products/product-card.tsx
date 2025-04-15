import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { cn } from '@/lib/constant/utils';
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
    const numericValue = typeof value === 'number' ? value : Number(value);
    const stringValue = numericValue.toFixed(2);
    const [intValue, floatValue] = stringValue.split('.');

    return (
      <p className={cn('text-xl md:text-2xl font-bold text-green-700', className)}>
        <span className="text-sm align-super">$</span>
        {intValue}
        <span className="text-sm align-super">.{floatValue}</span>
      </p>
    );
  };

  const renderStars = (rating: number = 0) => {
    const filledStars = Math.floor(rating);
    const totalStars = 5;
    return (
      <div className="text-yellow-400 text-sm flex gap-0.5">
        {Array.from({ length: totalStars }).map((_, i) => (
          <span key={i}>
            {i < filledStars ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group hover:shadow-xl hover:scale-[1.015] transition-transform duration-300 ease-in-out rounded-2xl border border-gray-200 overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 md:h-56 bg-gray-100">
            {product.images?.length ? (
              <Image
                src={product.images[0]}
                alt={product.name || "Product image"}
                fill
                className="object-cover w-full h-full transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>

          {renderStars(product.rating)}

          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="pt-2">
            <ProductPrice value={Number(product.price)} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
