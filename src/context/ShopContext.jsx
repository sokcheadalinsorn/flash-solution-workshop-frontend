
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Import Axios API from trainer's existing api.js
import { productApi } from "../services/api";

const ShopContext = createContext(null);

// Format product data from Spring Boot
const formatProduct = (product) => ({
  ...product,

  id: String(product.id),

  stock: Number(
    product.stockQuantity ??
      product.stock_quanity ??
      product.stock_quantity ??
      product.stock ??
      0
  ),

  brand:
    typeof product.brand === "object" && product.brand !== null
      ? (product.brand.name ?? "")
      : (product.brand ?? ""),

  category:
    typeof product.category === "object" && product.category !== null
      ? (product.category.name ?? "")
      : (product.category ?? ""),

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

  // GET products from Spring Boot
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
  useEffect(() => {
    localStorage.setItem("lumiere-cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product) =>
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      return found
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }];
    });

  // Update cart quantity
  const updateQuantity = (id, quantity) =>
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );

  // Remove product from cart
  const removeFromCart = (id) =>
    setCart((current) => current.filter((item) => item.id !== id));

  // UPDATE PRODUCT - PUT API
  const updateProduct = async (productId, editedProduct) => {
    try {
      // Find the existing product
      const existingProduct = products.find(
        (product) => String(product.id) === String(productId)
      );

      if (!existingProduct) {
        throw new Error("Product not found in frontend");
      }

      // Combine existing product data with edited data
      const updatedProduct = {
        ...existingProduct,
        ...editedProduct,
      };

      // Prepare data for Spring Boot
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: Number(updatedProduct.price),

        stock_quantity: Number(
          editedProduct.stock_quantity ??
            editedProduct.stockQuantity ??
            editedProduct.stock ??
            existingProduct.stock
        ),

        imageUrl:
          editedProduct.imageUrl ??
          editedProduct.image_url ??
          existingProduct.imageUrl ??
          "",

        sku: updatedProduct.sku ?? "",
      };

      console.log("Sending updated product:", productData);

      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:8080"
      ).replace(/\/$/, "");

      // Send PUT request to Spring Boot
      const response = await fetch(
        `${baseUrl}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update product: ${response.status}`
        );
      }

      // Receive updated product from backend
      const data = await response.json();

      console.log("Product updated successfully:", data);

      // Format the product before displaying it
      const formattedProduct = formatProduct({
        ...updatedProduct,
        ...data,
      });

      // Update React state
      setProducts((current) =>
        current.map((product) =>
          String(product.id) === String(productId)
            ? formattedProduct
            : product
        )
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
      (item) => String(item.id) === String(product.id)
    );

    // Existing product -> Update PostgreSQL
    if (exists) {
      return await updateProduct(product.id, product);
    }

    // New product -> Keep existing local behavior
    // Product creation is handled separately
    setProducts((current) => [product, ...current]);

    return product;
  };

  // DELETE PRODUCT - DELETE API
  const deleteProduct = async (id) => {
    try {
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:8080"
      ).replace(/\/$/, "");

      // Send DELETE request to Spring Boot
      const response = await fetch(
        `${baseUrl}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      // Check if the API request was successful
      if (!response.ok) {
        throw new Error(
          `Failed to delete product: ${response.status}`
        );
      }

      console.log("Product deleted successfully:", id);

      // Remove product from frontend after successful deletion
      setProducts((current) =>
        current.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      // Remove the deleted product from cart as well
      setCart((current) =>
        current.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      return true;

    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // Share data and functions with components
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
    [products, cart]
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
