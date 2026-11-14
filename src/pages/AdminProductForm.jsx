import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useShop } from "../context/ShopContext";
// new line was added below 1 line
import { productApi } from "../services/api";
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
  const { products, saveProduct } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  // new 1 line was update below
  // (this wiil help prevent users from submitting
  //   the form multiple times while the POST request is running)
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (editing) {
      const found = products.find((p) => p.id === id);
      if (found) setForm({ ...found });
    }
  }, [id, editing, products]);
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  // const submit = (e) => {
  //   e.preventDefault();
  //   if (!form.name.trim() || !form.price || !form.stock) {
  //     setError("Please complete the product name, price and stock.");
  //     return;
  //   }
  //   const product = {
  //     ...form,
  //     id: editing ? id : `P-${Date.now().toString().slice(-6)}`,
  //     price: Number(form.price),
  //     stock: Number(form.stock),
  //   };
  //   saveProduct(product);
  //   navigate("/admin/products");
  // };

  // replace all above these code to :
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!form.name.trim() || form.price === "" || form.stock === "") {
      setError("Please complete the product name, price and stock.");
      return;
    }

    // Keep existing local edit behavior for now.
    // We will connect PUT separately.
    if (editing) {
      const product = {
        ...form,
        id,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      saveProduct(product);
      navigate("/admin/products");
      return;
    }

    try {
      setSaving(true);

      // Prepare product data for Spring Boot(This prepares the JSON that Spring Boot expects.)
      const productData = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        stock_quanity: Number(form.stock),
        imageUrl: form.imageUrl.trim() || null,
      };

      // POST request using trainer's Axios service
      const createdProduct = await productApi.create(productData);

      console.log("Product created successfully:", createdProduct);

      // Convert the response to the frontend product format
      const newProduct = {
        ...createdProduct,

        id: String(createdProduct.id),

        stock: Number(
          createdProduct.stock_quanity ?? createdProduct.stockQuantity ?? 0,
        ),

        brand: createdProduct.brand?.name ?? "",
        category: createdProduct.category?.name ?? "",

        imageUrl: createdProduct.imageUrl || "/images/serum.svg",

        status: createdProduct.status ?? "Active",
        featured: createdProduct.featured ?? false,
      };

      // Update the existing React product list(Save the new product in React state)
      saveProduct(newProduct);

      // Redirect after successful POST(This happens only after the API request succeeds.)
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create product. Please check your backend.",
      );
    } finally {
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
          <label className="text-xs font-semibold">
            Category
            <select
              className="field mt-2"
              name="category"
              value={form.category}
              onChange={change}
            >
              <option>Skincare</option>
              <option>Makeup</option>
              <option>Haircare</option>
              <option>Body</option>
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

          {/* <button className="btn-primary">
            <Save size={16} /> Save product
          </button> */}

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
