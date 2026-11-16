import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function AdminProducts() {
  const { products, deleteProduct } = useShop();

  // Filter states
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // Get all unique categories from products
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  // Get all unique brands from products
  const brands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  }, [products]);

  // Filter products by search, status, category and brand
  const list = useMemo(
    () =>
      products.filter((p) => {
        const matchStatus = status === "All" || p.status === status;

        const matchCategory = category === "All" || p.category === category;

        const matchBrand = brand === "All" || p.brand === brand;

        const matchSearch = `${p.name ?? ""} ${p.brand ?? ""} ${p.id ?? ""}`
          .toLowerCase()
          .includes(q.toLowerCase());

        return matchStatus && matchCategory && matchBrand && matchSearch;
      }),
    [products, q, status, category, brand],
  );

  // DELETE product from backend
  const remove = async (p) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${p.name}?`,
    );

    if (!confirmed) return;

    setDeletingId(p.id);

    try {
      await deleteProduct(p.id);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-rose">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl">Products</h1>
          <p className="mt-2 text-sm text-muted">
            Manage your product catalogue and inventory.
          </p>
        </div>

        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {/* SEARCH AND FILTER SECTION */}
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-[#FBF8F2] p-4 shadow-sm">
        {/* Search */}
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className="field !h-12 !rounded-xl !pl-11 !pr-4 text-sm"
            placeholder="Search by product, brand or ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* CATEGORY FILTER */}
          <select
            aria-label="Filter by category"
            className="field !h-12"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* BRAND FILTER */}
          <select
            aria-label="Filter by brand"
            className="field !h-12"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="All">All Brands</option>

            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}
          <select
            aria-label="Filter by status"
            className="field !h-12"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-[#FBF8F2] shadow-sm">
        <div className="hidden grid-cols-[2fr_1fr_100px_90px_100px] gap-4 bg-[#ECEBDD] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>

        {list.map((p) => (
          <div
            key={p.id}
            className="grid gap-3 border-t border-line p-4 md:grid-cols-[2fr_1fr_100px_90px_100px] md:items-center md:gap-4 md:px-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.imageUrl || "/images/serum-ordinary.jpg"}
                className="h-12 w-12 rounded-lg bg-cream p-1 object-contain"
                alt={p.name}
              />

              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.brand} · {p.id}
                </p>
              </div>
            </div>

            <span className="text-xs text-muted">{p.category}</span>

            <span className="text-sm">${Number(p.price).toFixed(2)}</span>

            <span
              className={`text-xs ${
                p.stock < 10 ? "font-semibold text-rose" : "text-muted"
              }`}
            >
              {p.stock} units
            </span>

            <div className="flex gap-2">
              <Link
                title="Edit product"
                to={`/admin/products/${p.id}/edit`}
                className="grid h-9 w-9 place-items-center rounded-lg bg-cream hover:bg-blush"
              >
                <Pencil size={15} />
              </Link>

              <button
                type="button"
                title="Delete product"
                disabled={deletingId !== null}
                onClick={() => remove(p)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-cream text-rose hover:bg-blush disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="p-12 text-center text-sm text-muted">
            <Package className="mx-auto mb-3" size={24} />
            No matching products.
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {list.length} of {products.length} products
      </p>
    </>
  );
}
