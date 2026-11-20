import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { orderApi } from "../services/api";

export default function Checkout() {
  const { cart, removeFromCart } = useShop();

  const [done, setDone] = useState(false);
  const [savedOrder, setSavedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (placingOrder || !cart.length) return;

    setPlacingOrder(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const orderData = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      paymentMethod: String(formData.get("paymentMethod") || ""),

      items: cart.map((product) => ({
        productId: Number(product.id),
        quantity: Number(product.quantity),
      })),
    };

    try {
      const response = await orderApi.create(orderData);

      console.log("Order successfully created:", response);

      // Clear cart after successful order
      cart.forEach((product) => {
        removeFromCart(product.id);
      });

      setSavedOrder(response);
      setDone(true);
    } catch (err) {
      console.error("Order creation failed:", err);

      if (err.response?.status === 401) {
        setError("Your session expired. Please log in again.");
      } else {
        setError("Unable to place your order. Please try again.");
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (done) {
    return (
      <main className="container-page py-24 text-center">
        <p className="eyebrow text-rose">Thank you</p>

        <h1 className="mt-3 font-display text-4xl">
          Order placed successfully!
        </h1>

        <p className="mt-4 text-muted">
          Your order #{savedOrder?.id} has been received.
        </p>

        {/* <p className="mt-2 text-muted">
          Status: {savedOrder?.status || "PENDING"}
        </p> */}

        <p className="mt-2 text-muted">
          Total: ${Number(savedOrder?.totalAmount || 0).toFixed(2)}
        </p>

        <Link to="/shop" className="btn-primary mt-8">
          Continue shopping
        </Link>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>

        <Link to="/shop" className="btn-primary mt-6">
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="container-page max-w-3xl py-12">
      <p className="eyebrow text-rose">Almost yours</p>

      <h1 className="mt-3 font-display text-4xl">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]"
      >
        <div className="space-y-4">
          <h2 className="font-semibold">Contact & delivery</h2>

          <input
            required
            name="fullName"
            className="field"
            placeholder="Full name"
            defaultValue={user?.fullName || ""}
          />

          <input
            required
            name="email"
            type="email"
            className="field"
            placeholder="Email address"
            defaultValue={user?.email || ""}
          />

          <input
            required
            name="phone"
            type="tel"
            className="field"
            placeholder="Phone number"
            defaultValue={user?.phone || ""}
          />

          <input
            required
            name="address"
            className="field"
            placeholder="Delivery address"
          />

          <input required name="city" className="field" placeholder="City" />

          <label className="block text-sm font-medium">
            Payment method
            <select name="paymentMethod" className="field mt-2">
              <option value="Cash on delivery">Cash on delivery</option>

              <option value="Bank transfer (demo)">Bank transfer (demo)</option>
            </select>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={placingOrder}
            className="btn-primary w-full disabled:opacity-50"
          >
            {placingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div>

        <aside className="h-fit rounded-2xl bg-cream p-5">
          <h2 className="font-display text-xl">Summary</h2>

          {cart.map((product) => (
            <div
              key={product.id}
              className="mt-3 flex justify-between gap-3 text-xs"
            >
              <span>
                {product.name} × {product.quantity}
              </span>

              <span>${(product.price * product.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="mt-5 flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </form>
    </main>
  );
}
