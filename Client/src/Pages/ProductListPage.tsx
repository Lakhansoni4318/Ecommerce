import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/apiService";

type Product = {
  _id: string;
  productName: string;
  description: string;
  imageUrls: string[];
  sellingPrice: number;
  costPrice: number;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const buyNow = async (id: string, quantity: number) => {
    const payload = [{ productId: id, quantity }];
    localStorage.setItem("cart", JSON.stringify(payload));
    navigate("/payment");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const request = { category: categoryName };
        const response = await api.fetchAllProducts(request);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="bg-rose-50 py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-rose-600 mb-8 capitalize">
          {categoryName} Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.productName}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 bg-white"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {product.productName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="mt-3">
                    <span className="text-rose-600 font-bold text-lg">
                      ₹{product.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-400 ml-2">
                      ₹{product.costPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Prevent click propagation so Buy Now doesn't trigger card navigation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      buyNow(product._id, 1);
                    }}
                    className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
