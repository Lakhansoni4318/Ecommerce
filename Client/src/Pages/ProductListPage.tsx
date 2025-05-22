import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SidebarFilters from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import api from "../../api/apiService";

type Product = {
  productName: string;
  productCategory: string;
  stock: number;
  imageUrl: string;
  costPrice: number;
  sellingPrice: number;
  rating: number;
  quantity: number;
  _id: number;
};

export default function ProductListPage() {
  const { categoryName } = useParams();
  const [filters, setFilters] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let request = {
          category: categoryName,
        };
        const response = await api.fetchAllProducts(request);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
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
            {categoryName ? `${categoryName} Products` : "Product List"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                productName={product.productName}
                productCategory={product.productCategory}
                stock={product.stock.toString()}
                imageUrl={product.imageUrl}
                costPrice={product.costPrice}
                sellingPrice={product.sellingPrice}
                rating={product.rating}
                quantity={product.quantity}
                _id={product._id}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
