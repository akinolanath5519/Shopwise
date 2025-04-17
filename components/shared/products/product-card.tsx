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
        <span className="text-gray-500 text-xs ml-1">({rating || 0})</span>
      </div>
    );
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200 ease-in-out rounded-xl border border-gray-100 overflow-hidden bg-white">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-square bg-gray-50">
            {product.images?.length ? (
              <Image
                src={product.images[0]}
                alt={product.name || "Product image"}
                fill
                className="object-cover w-full h-full transition duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">No Image</span>
              </div>
            )}
          </div>
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-gray-700 shadow-sm">
                {product.category}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>

          {renderStars(product.rating)}

          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          <div className="pt-1 flex items-center justify-between">
            <ProductPrice value={Number(product.price)} />
            
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;