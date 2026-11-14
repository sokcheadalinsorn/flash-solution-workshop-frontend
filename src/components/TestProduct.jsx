import { useState, useEffect } from "react";

function TestProduct() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Lumière Beauty Products</h1>

      {error && <p>{error}</p>}

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}

export default TestProduct;