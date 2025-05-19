import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import EmptyProduct from './EmptyProduct';
import ProductForm, { Product } from './ProductForm';
import api from '../../api/apiService'; 

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let request = {};
        const response = await api.fetchAllProducts(request);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    try {
      const response = api.addProduct(newProduct);
      alert('Product added successfully!');
      console.log('Saved product:', response.data);
    } catch (error: any) {
      console.error('Failed to add product:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
    setIsAddingProduct(false);
  };

  const filteredProducts = products.filter(prod =>
    prod.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (products.length === 0 && !isAddingProduct) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaPlus /> Add New Product
          </button>
        </div>
        <EmptyProduct />
      </div>
    );
  }

  if (isAddingProduct) {
    return (
      <ProductForm
        onCancel={() => setIsAddingProduct(false)}
        onSave={handleAddProduct}
      />
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="Search Products"
      />

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Product</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Inventory</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((prod, idx) => (
            <tr key={idx} className="text-center border-t">
              <td className="p-2">{prod.productName}</td>
              <td className="p-2">{prod.productCategory}</td>
              <td className="p-2">${prod.costPrice}</td>
              <td className="p-2">${prod.sellingPrice}</td>
              <td className="p-2">{prod.stock}</td>
              <td className="p-2">
                {Number(prod.stock) > 0 ? 'In Stock' : 'Out of Stock'}
              </td>
              <td className="p-2">--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
