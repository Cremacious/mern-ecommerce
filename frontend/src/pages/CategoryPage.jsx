import { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router';
// import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();

  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>

        <div>
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {/* {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))} */}
        </div>
      </div>
    </div>
  );
};
export default CategoryPage;
