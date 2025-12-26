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
import { useTheme } from "../../contexts/ThemeContext";

export default function SideFilterBar({
  onChangeFilters,
  mobileOpen,
  setMobileOpen,
}) {
  const { dark } = useTheme();

  // prevent refetch
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
    materials: false,
    packs: false,
    patterns: false,
    discounts: false,
    coupons: false,
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

  /* ================= FETCH METADATA ONCE ================= */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const [
          c1,
          c2,
          c3,
          c4,
          c5,
          c6,
          c7,
          c8,
        ] = await Promise.all([
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
        console.error("Metadata fetch error", err);
      }
    })();
  }, []);

  /* ================= DEBOUNCED FILTER UPDATE ================= */
  useEffect(() => {
    const t = setTimeout(() => onChangeFilters(filters), 150);
    return () => clearTimeout(t);
  }, [filters, onChangeFilters]);

  const toggle = (section) =>
    setOpen((p) => ({ ...p, [section]: !p[section] }));

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
      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[150] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-80 p-6 overflow-y-auto z-[200]
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:rounded-3xl
          ${
            dark
              ? "bg-[#0F1012] text-white border-r border-[#262626]"
              : "bg-white text-gray-900 border-r border-gray-200"
          }
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#D4AF37] text-xl"
          >
            ✕
          </button>
        </div>

        {/* TITLE */}
        <h3 className="text-2xl font-semibold text-[#D4AF37] mb-6">
          Refine Results
        </h3>

        {/* FILTER SECTIONS */}
        <div className="space-y-5">
          {ORDER.map((section) => (
            <div
              key={section}
              className={`rounded-2xl p-4 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={() => toggle(section)}
                className="w-full flex justify-between items-center text-sm font-semibold tracking-wide"
              >
                <span className="capitalize text-[#D4AF37]">
                  {section}
                </span>
                <span className={dark ? "text-[#A1A1AA]" : "text-gray-500"}>
                  {open[section] ? "−" : "+"}
                </span>
              </button>

              {open[section] && (
                <div className="mt-4 space-y-2">
                  {data[section].map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 text-sm cursor-pointer ${
                        dark
                          ? "text-[#A1A1AA] hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters[section].includes(item.id)}
                        onChange={() => updateFilter(section, item.id)}
                        className="accent-[#D4AF37] w-4 h-4"
                      />
                      {item.name}
                    </label>
                  ))}

                  {data[section].length === 0 && (
                    <p className="text-xs text-[#71717A]">
                      No options
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CLEAR */}
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
          className={`mt-8 w-full py-2 rounded-full text-sm transition border ${
            dark
              ? "border-[#262626] text-[#D4AF37] hover:bg-[#14161A]"
              : "border-gray-300 text-[#D4AF37] hover:bg-gray-100"
          }`}
        >
          Clear All Filters
        </button>
      </aside>
    </>
  );
}
