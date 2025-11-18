// src/components/layout/SideFilterBar.jsx
import { useEffect, useState, useRef } from "react";
import {
  getCategories,
  getColors,
  getSizes,
  getMaterials,
  getPacks,
  getPatterns,
  getDiscounts,
  getCoupons,
} from "../../api/metadataApi";

export default function SideFilterBar({ onChangeFilters, mobileOpen, setMobileOpen }) {
  // ⭐ Cache flag to prevent refetching
  const fetchedRef = useRef(false);

  const [data, setData] = useState({
    categories: [],
    colors: [],
    sizes: [],
    materials: [],
    packs: [],
    patterns: [],
    discounts: [],
    coupons: [],
  });

  const [open, setOpen] = useState({
    categories: true,
    colors: true,
    sizes: true,
    materials: true,
    packs: true,
    patterns: true,
    discounts: true,
    coupons: true,
  });

  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    materials: [],
    packs: [],
    patterns: [],
    discounts: [],
    coupons: [],
  });

  // ⭐ FIX 1: Fetch metadata only once
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const [c1, c2, c3, c4, c5, c6, c7, c8] = await Promise.all([
          getCategories(),
          getColors(),
          getSizes(),
          getMaterials(),
          getPacks(),
          getPatterns(),
          getDiscounts(),
          getCoupons(),
        ]);

        setData({
          categories: c1.data || [],
          colors: c2.data || [],
          sizes: c3.data || [],
          materials: c4.data || [],
          packs: c5.data || [],
          patterns: c6.data || [],
          discounts: c7.data || [],
          coupons: c8.data || [],
        });
      } catch (err) {
        console.log("Metadata fetch error", err);
      }
    })();
  }, []);

  // ⭐ FIX 2: Debounce filter updates → smoother filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeFilters(filters);
    }, 150);

    return () => clearTimeout(timeout);
  }, [filters]);

  const toggle = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (section, id) => {
    setFilters((prev) => {
      const selected = prev[section];
      return {
        ...prev,
        [section]: selected.includes(id)
          ? selected.filter((v) => v !== id)
          : [...selected, id],
      };
    });
  };

  // ⭐ FIX 3: Keep stable order of filters
  const ORDER = [
    "categories",
    "colors",
    "sizes",
    "materials",
    "packs",
    "patterns",
    "discounts",
    "coupons",
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[150] lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-[#E8D9A6] shadow-2xl
          p-5 overflow-y-auto z-[200] transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow lg:rounded-2xl lg:z-auto
        `}
      >
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#8C6B1F] text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-[#8C6B1F]">Filters</h3>

        {/* FILTER SECTIONS */}
        <div className="space-y-5">
          {ORDER.map((section) => (
            <div key={section} className="bg-[#FFFDF5] p-3 rounded-lg border border-[#F0E5CC]">
              <button
                onClick={() => toggle(section)}
                className="w-full flex justify-between text-[#8C6B1F] font-medium mb-2"
              >
                <span className="capitalize">{section}</span>
                <span>{open[section] ? "−" : "+"}</span>
              </button>

              {open[section] && (
                <div className="pl-2 space-y-2">
                  {data[section].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-[#C9A227] w-4 h-4"
                        checked={filters[section].includes(item.id)}
                        onChange={() => updateFilter(section, item.id)}
                      />
                      {item.name}
                    </label>
                  ))}

                  {data[section].length === 0 && (
                    <p className="text-xs text-gray-400">No options</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setFilters({
              categories: [],
              colors: [],
              sizes: [],
              materials: [],
              packs: [],
              patterns: [],
              discounts: [],
              coupons: [],
            })
          }
          className="mt-5 text-sm text-red-600 underline"
        >
          Clear All Filters
        </button>
      </aside>
    </>
  );
}
