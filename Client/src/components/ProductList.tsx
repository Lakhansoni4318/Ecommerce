import { useEffect, useState } from 'react';
import { FaPlus, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import EmptyProduct from './EmptyProduct';
import ProductForm, { Product } from './ProductForm';
import api from '../../api/apiService';

interface ProductWithId extends Product {
  _id: string;
  imageUrls: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMenuOpenFor, setActionMenuOpenFor] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.fetchAllProducts({});
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, newProduct);
        alert('Product updated successfully!');
      } else {
        await api.addProduct(newProduct);
        alert('Product added successfully!');
      }
      setIsAddingProduct(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      alert('Product deleted successfully!');
      await fetchProducts();
      setActionMenuOpenFor(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(prod =>
    prod.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show product form when editing or adding
  if (isAddingProduct || editingProduct) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </h2>
          {!editingProduct && (
            <button
              onClick={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
        <ProductForm
          onCancel={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
          onSave={handleAddProduct}
          initialProduct={editingProduct ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => {
            setIsAddingProduct(true);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="Search Products"
      />

      {filteredProducts.length === 0 ? (
        <EmptyProduct />
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Product</th>
              <th className="p-2">Category</th>
              <th className="p-2">Cost Price</th>
              <th className="p-2">Selling Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod._id} className="text-center border-t relative">
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={prod.imageUrls[0]}
                    alt={prod.productName}
                    className="w-10 h-10 object-cover rounded"
                  />
                  {prod.productName}
                </td>
                <td className="p-2">{prod.productCategory}</td>
                <td className="p-2">${prod.costPrice}</td>
                <td className="p-2">${prod.sellingPrice}</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2">
                  {Number(prod.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                </td>
                <td className="p-2 relative">
                  <button
                    onClick={() =>
                      setActionMenuOpenFor(prev => (prev === prod._id ? null : prod._id))
                    }
                    className="p-1 rounded hover:bg-gray-200"
                    aria-label="Open actions menu"
                  >
                    <FaEllipsisH />
                  </button>

                  {actionMenuOpenFor === prod._id && (
                    <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg z-10 w-32">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsAddingProduct(false);
                          setActionMenuOpenFor(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
