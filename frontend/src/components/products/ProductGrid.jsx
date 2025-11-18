// src/components/products/ProductGrid.jsx
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-lg font-medium">No products found.</p>
        <p className="text-sm text-gray-500 mt-1">
          Please check back later — new Eleganza collections arriving soon!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Elegant Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-semibold text-[#3A3A3A]">
          Our Exclusive Collection
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-2">
          Discover timeless designs & modern luxury crafted for every occasion.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Product Grid */}
      <div
        className="
          grid
          grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
          gap-6 md:gap-8
          px-2 sm:px-0
          animate-fadeIn
        "
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
