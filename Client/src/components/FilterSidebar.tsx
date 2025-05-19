// components/SidebarFilters.tsx
import { SlidersHorizontal, Star, X } from 'lucide-react';

interface SidebarFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  showCategoryFilter?: boolean;
}

const categories = ['Mobiles', 'Laptops', 'Clothing', 'Appliances'];
const brands = ['Apple', 'Samsung', 'Xiaomi', 'HP', 'Dell'];

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  setFilters,
  showCategoryFilter = true,
}) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const selected = filters[key] || [];
    const updated = selected.includes(value)
      ? selected.filter((item: string) => item !== value)
      : [...selected, value];
    setFilters({ ...filters, [key]: updated });
  };

  const handleRatingChange = (value: number) => {
    setFilters({ ...filters, rating: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, price: Number(e.target.value) });
  };

  const clearFilters = () => setFilters({});

  return (
    <aside className="w-full md:w-72 bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-500" />
          Filters
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 flex items-center gap-1 hover:underline"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      {showCategoryFilter && (
        <div>
          <h3 className="text-md font-medium mb-2">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={filters.categories?.includes(cat) || false}
                  onChange={() => toggleArrayFilter('categories', cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-md font-medium mb-2">Price</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>₹1,000</span>
          <span>₹{filters.price || 50000}</span>
          <span>₹100,000</span>
        </div>
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={filters.price || 50000}
          onChange={handlePriceChange}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={filters.brands?.includes(brand) || false}
                onChange={() => toggleArrayFilter('brands', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="rating"
                className="accent-yellow-400"
                checked={filters.rating === star}
                onChange={() => handleRatingChange(star)}
              />
              <span className="flex items-center gap-1">
                {star} <Star className="w-4 h-4 text-yellow-400" /> & Up
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
