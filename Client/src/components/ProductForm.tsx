import { FC, useState } from 'react';

interface ProductFormProps {
  onCancel: () => void;
  onSave: (product: Product) => void;
}

export interface Product {
  productName: string;
  productCategory: string;
  productDescription: string;
  costPrice: number;
  sellingPrice: number;
  stock: string;
  imageUrls: string[];
}

const ProductForm: FC<ProductFormProps> = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState<Product>({
    productName: '',
    productCategory: '',
    productDescription: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: '',
    imageUrls: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedImages = [...formData.imageUrls];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: updatedImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Basic Details */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Product Name</label>
          <input
            name="productName"
            type="text"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Product Category</label>
          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Books</option>
            <option>Home</option>
            <option>Beauty</option>
            <option>Toys and Games</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          placeholder="Enter product description"
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={4}
        />
      </div>

      {/* Prices & Stock */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Cost Price</label>
          <input
            name="costPrice"
            type="number"
            value={formData.costPrice}
            onChange={handleChange}
            placeholder="Enter cost price"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Selling Price</label>
          <input
            name="sellingPrice"
            type="number"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="Enter selling price"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Multiple Image URLs */}
      <div>
        <label className="block mb-2 font-semibold">Image URLs</label>
        <div className="space-y-2">
          {formData.imageUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              value={url}
              onChange={e => handleImageUrlChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addImageField}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Add another image
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Save Product
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
