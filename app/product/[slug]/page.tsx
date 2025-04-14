import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Note: We type props.params as a Promise to indicate it must be awaited.
const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  // Await the params promise and then extract slug.
  const { slug } = await props.params;

  // Fetch the product using the slug
  const product = await getProductBySlug(slug);

  // If product is not found, trigger the 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <Badge variant="outline" className="w-fit">
            {product.category}
          </Badge>

          <p className="text-xl font-semibold text-green-600">
            ₦{product.price?.toLocaleString()}
          </p>

          <p className="text-gray-700">{product.description}</p>

          <div className="mt-4 flex gap-4 flex-col sm:flex-row">
            <Button className="w-full sm:w-auto">Add to Cart</Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
