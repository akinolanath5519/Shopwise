import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import AddToCart from "@/components/shared/products/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.action";

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-4">
            {product.images && product.images.length > 0 ? (
              <div className="aspect-square w-full relative overflow-hidden rounded-lg">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <div className="space-y-5">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-semibold text-gray-900">
                ₦{product.price?.toLocaleString()}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4">
              <AddToCart
                cart={cart}
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price.toNumber(),
                  qty: 1,
                  image: product.images[0] || "",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;