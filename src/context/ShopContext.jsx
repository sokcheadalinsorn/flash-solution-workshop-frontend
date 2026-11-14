import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Import Axios API from trainer's existing api.js
import { productApi } from "../services/api";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lumiere-cart")) || [];
    } catch {
      return [];
    }
  });

  // GET products from Spring Boot using Axios
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();

        // NEW: Check products received from Spring Boot
        console.log("Products from backend:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of products");
        }

        const formattedProducts = data.map((product) => ({
          ...product,
          id: String(product.id),

          stock: Number(
            product.stockQuantity ??
              product.stock_quanity ??
              product.stock_quantity ??
              product.stock ??
              0,
          ),

          brand:
            typeof product.brand === "object"
              ? (product.brand?.name ?? "")
              : (product.brand ?? ""),

          category:
            typeof product.category === "object"
              ? (product.category?.name ?? "")
              : (product.category ?? ""),

          imageUrl:
            // product.imageUrl ?? product.image_url ?? "/images/serum.svg",
            product.imageUrl ?? product.image_url ?? "",

          status: product.status ?? "Active",
          featured: product.featured ?? false,
        }));

        // ✅ NEW: Check products after formatting
        console.log("Formatted products:", formattedProducts);

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

  // Keep cart data in localStorage
  useEffect(
    () => localStorage.setItem("lumiere-cart", JSON.stringify(cart)),
    [cart],
  );

  // Add product to cart
  const addToCart = (product) =>
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      return found
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }];
    });

  // Update quantity
  const updateQuantity = (id, quantity) =>
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
    );

  // Remove product from cart
  const removeFromCart = (id) =>
    setCart((current) => current.filter((item) => item.id !== id));

  // Save product (still local-only for now)
  const saveProduct = (product) =>
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id);

      return exists
        ? current.map((item) => (item.id === product.id ? product : item))
        : [product, ...current];
    });

  // Delete product (still local-only for now)
  const deleteProduct = (id) =>
    setProducts((current) => current.filter((item) => item.id !== id));

  const value = useMemo(
    () => ({
      products,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveProduct,
      deleteProduct,
    }),
    [products, cart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
