import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SidebarFilters from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Product } from '../components/ProductForm';
import api from '../../api/apiService'; 

export default function ProductListPage() {
  const { categoryName } = useParams();
  const [filters, setFilters] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let request = {
          category: categoryName
        };
        const response = await api.fetchAllProducts(request);
        console.log(response)
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <SidebarFilters
          filters={filters}
          setFilters={setFilters}
          showCategoryFilter={!categoryName}
        />

        <main className="flex-1 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {categoryName ? `${categoryName} Products` : 'Product List'}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
