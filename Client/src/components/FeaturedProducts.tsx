import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../../api/apiService";

type Product = {
  productName: string;
  productCategory: string;
  stock: number;
  imageUrls: string[];
  costPrice: number;
  sellingPrice: number;
  rating: number;
  quantity: number;
  inCart: boolean;
  inWatchlist: boolean;
  _id: number;
};

const FeaturedProducts = () => {
  const [sortOption, setSortOption] = useState("popularity");
  const [products, setProducts] = useState<Product[]>([]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let request = {};
        const response = await api.fetchAllProducts(request);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 px-4">
        <div>
          <h2 className="text-4xl font-bold text-blue-600">
            Featured Products
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Handpicked premium products just for you
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            productName={product.productName}
            productCategory={product.productCategory}
            stock={product.stock.toString()}
            imageUrls={product.imageUrls}
            costPrice={product.costPrice}
            sellingPrice={product.sellingPrice}
            rating={product.rating}
            inCart={product.inCart}
            inWatchlist={product.inWatchlist}
            quantity={product.quantity}
            _id={product._id}
          />
        ))}

      </div>
    </div>
  );
};

export default FeaturedProducts;
