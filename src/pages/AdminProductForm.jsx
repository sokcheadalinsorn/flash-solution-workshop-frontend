import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { productApi } from "../services/api";
import { categoryApi } from "../services/api";
const empty = {
  id: "",
  name: "",
  brand: "",
  category: "Skincare",
  price: "",
  stock: "",
  status: "Active",
  featured: false,
  imageUrl: "",
  description: "",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { products, saveProduct, updateProduct } = useShop();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // ADDED: CATEGORY - Store categories from PostgreSQL
  const [categories, setCategories] = useState([]);

  // ADDED: CATEGORY - Fetch categories from Spring Boot
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();

      if (!Array.isArray(data)) {
        throw new Error("Invalid categories response");
      }

      setCategories(data);

      console.log("Categories loaded successfully:", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Unable to load categories from backend.");
    }
  };

  fetchCategories();
}, []);

  // LOAD PRODUCT WHEN EDITING
  useEffect(() => {
    if (editing) {
      const found = products.find((p) => p.id === id);

      if (found) setForm({ ...found });
    }
  }, [id, editing, products]);

  // HANDLE INPUT CHANGES
  const change = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SUBMIT PRODUCT
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Step 1: Validate required fields
    if (!form.name.trim() || form.price === "" || form.stock === "") {
      setError("Please complete the product name, price and stock.");
      return;
    }

    try {
      // Step 2: Prevent multiple submissions
      setSaving(true);

      // Step 1: Find selected category
      const selectedCategory = categories.find(
        (category) =>
          category.name.toLowerCase() === form.category.toLowerCase(),
      );

      // Step 2: Check if category exists
      if (!selectedCategory) {
        throw new Error("Category not found in database");
      }

      // Step 3: Prepare product data
      const productData = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        stock_quanity: Number(form.stock),
        imageUrl: form.imageUrl.trim(),
        sku: form.sku ?? "",

        // Category relationship
        category: {
          id: selectedCategory.id,
        },
      };

      // EDIT PRODUCT - PUT REQUEST
      if (editing) {
        console.log("Updating product ID:", id);
        console.log("Updated product data:", productData);

        // Send PUT request through ShopContext
        const updatedProduct = await updateProduct(id, productData);

        alert("Product updated successfully!");

        navigate("/admin/products");
        return;
      }

      // CREATE PRODUCT - POST REQUEST
      const createdProduct = await productApi.create(productData);

      console.log("Product created successfully:", createdProduct);

      // Convert response to frontend product format
      const newProduct = {
        ...createdProduct,

        id: String(createdProduct.id),

        stock: Number(
          createdProduct.stock_quanity ?? createdProduct.stockQuantity ?? 0,
        ),

        brand: createdProduct.brand?.name ?? "",

        // ADDED: CATEGORY - Display selected category
        category: createdProduct.category?.name ?? form.category,

        // ADDED: CATEGORY - Keep category ID
        categoryId: createdProduct.category?.id ?? selectedCategory.id,

        imageUrl: createdProduct.imageUrl ?? createdProduct.image_url ?? "",

        status: createdProduct.status ?? "Active",
        featured: createdProduct.featured ?? false,
      };

      // Update React state
      await saveProduct(newProduct);

      alert("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product. Please check your backend.",
      );
    } finally {
      // Step 4: Enable the save button again
      setSaving(false);
    }
  };

  return (
    <>
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted"
      >
        <ArrowLeft size={15} /> Back to products
      </Link>

      <div className="mt-5">
        <p className="eyebrow text-rose">
          {editing ? "Catalogue update" : "New catalogue item"}
        </p>

        <h1 className="mt-2 font-display text-4xl">
          {editing ? "Edit product" : "Add product"}
        </h1>

        <p className="mt-2 text-sm text-muted">
          Enter the product information below.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 max-w-3xl rounded-2xl border border-line bg-white p-6 md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-xs font-semibold">
            Product name *
            <input
              className="field mt-2"
              name="name"
              value={form.name}
              onChange={change}
              required
              placeholder="e.g. Daily Hydrating Serum"
            />
          </label>

          <label className="text-xs font-semibold">
            Brand
            <input
              className="field mt-2"
              name="brand"
              value={form.brand}
              onChange={change}
              placeholder="Brand name"
            />
          </label>

          {/* CATEGORY - FETCHED FROM POSTGRESQL */}
          <label className="text-xs font-semibold">
  Category
  <select
    className="field mt-2"
    name="category"
    value={form.category}
    onChange={change}
    disabled={categories.length === 0}
  >
    {categories.length === 0 && (
      <option value="">No categories available</option>
    )}

    {categories.map((category) => (
      <option key={category.id} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>
</label>

          <label className="text-xs font-semibold">
            Price (USD) *
            <input
              className="field mt-2"
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={change}
              required
              placeholder="0.00"
            />
          </label>

          <label className="text-xs font-semibold">
            Stock quantity *
            <input
              className="field mt-2"
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={change}
              required
              placeholder="0"
            />
          </label>

          <label className="text-xs font-semibold">
            Status
            <select
              className="field mt-2"
              name="status"
              value={form.status}
              onChange={change}
            >
              <option>Active</option>
              <option>Draft</option>
            </select>
          </label>

          <label className="text-xs font-semibold md:col-span-2">
            Image URL
            <input
              className="field mt-2"
              name="imageUrl"
              value={form.imageUrl}
              onChange={change}
              placeholder="https://example.com/product.jpg"
            />
          </label>

          <label className="text-xs font-semibold md:col-span-2">
            Description
            <textarea
              className="field mt-2 min-h-28"
              name="description"
              value={form.description}
              onChange={change}
              placeholder="Describe the product..."
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              name="featured"
              checked={Boolean(form.featured)}
              onChange={change}
            />{" "}
            Feature this product on the home page
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-rose">{error}</p>}

        <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-6">
          {/* Change: Update the Save Button */}

          {/* replace with these code below: */}

          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={16} />

            {saving ? "Saving..." : "Save product"}
          </button>

          {/* This prevents double submissions while saving. */}

          <Link to="/admin/products" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
