
import ProductList from '@/components/shared/products/product-list';
import { getLatestProducts } from '@/lib/actions/product.action';



const HomePage = async () => {
  const latestProducts= await getLatestProducts();
  return (
    <>
    <ProductList  data={latestProducts} title='New Arrivals'/>
    </>

  )
;
}
 
export default HomePage;