import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productApi } from "../services/api";

const ShopContext = createContext(null);

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

// Convert backend product data to frontend format
const formatProduct = (product) => ({
  ...product,

  id: String(product.id),

  // FIX: Stock quantity
  stock: Number(
    product.stock_quanity ??
      product.stockQuantity ??
      product.stock_quantity ??
      product.stock ??
      0,
  ),

  // FIX: Brand name
  brand:
    typeof product.brand === "object" && product.brand !== null
      ? (product.brand.name ?? "")
      : (product.brand ?? ""),

  brandId:
    typeof product.brand === "object" && product.brand !== null
      ? (product.brand.id ?? null)
      : (product.brandId ?? null),

  // Category name
  category:
    typeof product.category === "object" && product.category !== null
      ? (product.category.name ?? "")
      : (product.category ?? ""),

  categoryId:
    typeof product.category === "object" && product.category !== null
      ? (product.category.id ?? null)
      : (product.categoryId ?? null),

  imageUrl: product.imageUrl ?? product.image_url ?? "",

  status: product.status ?? "Active",

  featured: product.featured ?? false,
});

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lumiere-cart")) || [];
    } catch {
      return [];
    }
  });

  // GET ALL PRODUCTS
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();

        console.log("Products from backend:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of products");
        }

        const formattedProducts = data.map(formatProduct);

        if (active) {
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("lumiere-cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find(
        (item) => String(item.id) === String(product.id),
      );

      return found
        ? current.map((item) =>
            String(item.id) === String(product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }];
    });
  };

  // UPDATE CART QUANTITY
  const updateQuantity = (id, quantity) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => String(item.id) !== String(id))
        : current.map((item) =>
            String(item.id) === String(id) ? { ...item, quantity } : item,
          ),
    );
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => String(item.id) !== String(id)),
    );
  };

  // UPDATE PRODUCT - PUT REQUEST
  const updateProduct = async (productId, editedProduct) => {
    try {
      const existingProduct = products.find(
        (product) => String(product.id) === String(productId),
      );

      if (!existingProduct) {
        throw new Error("Product not found in frontend");
      }

      const updatedProduct = {
        ...existingProduct,
        ...editedProduct,
      };

      // FIX: Use stock_quanity to match Spring Boot
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description ?? "",
        price: Number(updatedProduct.price),

        stock_quanity: Number(
          editedProduct.stock_quanity ??
            editedProduct.stock ??
            existingProduct.stock,
        ),

        imageUrl: updatedProduct.imageUrl ?? "",
        sku: updatedProduct.sku ?? "",
      };

      // Include brand relationship when an ID is available
      const brandId = editedProduct.brandId ?? existingProduct.brandId;

      if (brandId !== null && brandId !== undefined && brandId !== "") {
        productData.brand = {
          id: Number(brandId),
        };
      }

      // Include category relationship when an ID is available
      const categoryId =
        editedProduct.category?.id ??
        editedProduct.categoryId ??
        existingProduct.categoryId;

      if (
        categoryId !== null &&
        categoryId !== undefined &&
        categoryId !== ""
      ) {
        productData.category = {
          id: Number(categoryId),
        };
      }

      console.log("Sending updated product:", productData);

      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const responseText = await response.text();

      const data = responseText ? JSON.parse(responseText) : {};

      console.log("Product updated successfully:", data);

      const formattedProduct = formatProduct({
        ...existingProduct,
        ...editedProduct,
        ...data,
      });

      // Update React state
      setProducts((current) =>
        current.map((product) =>
          String(product.id) === String(productId) ? formattedProduct : product,
        ),
      );

      return formattedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // SAVE PRODUCT
  const saveProduct = async (product) => {
    const exists = products.some(
      (item) => String(item.id) === String(product.id),
    );

    if (exists) {
      return await updateProduct(product.id, product);
    }

    // POST is handled in AdminProductForm.jsx
    const formattedProduct = formatProduct(product);

    setProducts((current) => [formattedProduct, ...current]);

    return formattedProduct;
  };

  // DELETE PRODUCT - DELETE REQUEST
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      console.log("Product deleted successfully:", id);

      setProducts((current) =>
        current.filter((item) => String(item.id) !== String(id)),
      );

      setCart((current) =>
        current.filter((item) => String(item.id) !== String(id)),
      );

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // SHARE DATA AND FUNCTIONS
  const value = useMemo(
    () => ({
      products,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, cart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
