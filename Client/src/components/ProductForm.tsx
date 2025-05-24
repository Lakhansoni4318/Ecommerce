import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ProductFormProps {
  onCancel: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product;
}

export interface Product {
  productName: string;
  productCategory: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number | string;
  imageUrls: string[];
}

const MAX_IMAGES = 4;

const ProductForm: FC<ProductFormProps> = ({
  onCancel,
  onSave,
  initialProduct,
}) => {
  const [formData, setFormData] = useState<Product>({
    productName: "",
    productCategory: "",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: "",
    imageUrls: [""],
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        productName: initialProduct.productName || "",
        productCategory: initialProduct.productCategory || "",
        description: initialProduct.description || "",
        costPrice: initialProduct.costPrice || 0,
        sellingPrice: initialProduct.sellingPrice || 0,
        stock: initialProduct.stock || "",
        imageUrls:
          Array.isArray(initialProduct.imageUrls) &&
          initialProduct.imageUrls.length > 0
            ? initialProduct.imageUrls
            : [""],
      });
    }
  }, [initialProduct]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? value : value,
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedImages = [...formData.imageUrls];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, imageUrls: updatedImages }));
  };

  const addImageField = () => {
    if (formData.imageUrls.length < MAX_IMAGES) {
      setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
    }
  };

  // ...inside ProductForm component

  const handleRemoveImageField = (index: number) => {
    if (formData.imageUrls.length > 1) {
      const updatedImages = [...formData.imageUrls];
      updatedImages.splice(index, 1);
      setFormData((prev) => ({ ...prev, imageUrls: updatedImages }));
    }
  };

  // Modified validateForm()
  const validateForm = (): boolean => {
    const {
      productName,
      productCategory,
      description,
      costPrice,
      sellingPrice,
      stock,
      imageUrls,
    } = formData;

    if (!productName.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!productCategory.trim()) {
      toast.error("Product category is required");
      return false;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (costPrice <= 0) {
      toast.error("Cost price must be greater than 0");
      return false;
    }

    if (sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }

    if (!stock || Number(stock) <= 0) {
      toast.error("Stock quantity must be greater than 0");
      return false;
    }

    if (
      imageUrls.length === 0 ||
      imageUrls.length > MAX_IMAGES ||
      imageUrls.some((url) => !url.trim())
    ) {
      toast.error("All image URLs must be filled and non-empty");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (!isValid) return; // ✅ Prevents onSave() and toast if validation fails

    onSave({
      ...formData,
      stock: Number(formData.stock),
    });

    toast.success("Product saved successfully");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Product Name & Category */}
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
          name="description"
          value={formData.description}
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

      {/* Image URLs */}
      {/* Image URLs */}
      <div>
        <label className="block mb-2 font-semibold">Image URLs</label>
        <div className="space-y-2">
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {formData.imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImageField(index)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete this image URL"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
        {formData.imageUrls.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            + Add another image
          </button>
        )}
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
