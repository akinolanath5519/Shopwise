import ProductCard from './product-card';
import { Product } from "@/types";

const ProductList = ({ data, title }: { data: Product[]; title?: string }) => {
  return (
    <div className="my-10">
      <h2 className="text-3xl font-extrabold text-black mb-6">{title}</h2>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Products not found</p>
      )}
    </div>
  );
};

export default ProductList;
