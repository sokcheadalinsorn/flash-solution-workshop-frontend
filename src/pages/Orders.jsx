import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in customer
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // Fetch order history from Spring Boot
  useEffect(() => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadOrders() {
      try {
        const data = await orderApi.getMyOrders();

        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : data?.orders ?? []);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);

        if (!cancelled) {
          setError(
            err.response?.status === 401
              ? "Your session expired. Please sign in again."
              : "Unable to load your order history."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  return (
    <main className="container-page min-h-[55vh] py-16">
      <p className="eyebrow text-rose">Your account</p>

      <h1 className="mt-3 font-display text-4xl">
        Order history
      </h1>

      {/* Customer not logged in */}
      {!user?.userId ? (
        <div className="mt-8 rounded-2xl border border-line p-8 text-center">
          <p className="text-muted">
            Please sign in to view your orders.
          </p>

          <Link
            to="/login"
            state={{ from: "/orders" }}
            className="btn-primary mt-5"
          >
            Sign in
          </Link>
        </div>
      ) : loading ? (
        <p className="mt-8 text-muted">
          Loading your orders...
        </p>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-line p-8 text-center">
          <p className="text-red-600">{error}</p>
          <Link
            to="/login"
            state={{ from: "/orders" }}
            className="btn-primary mt-5"
          >
            Sign in
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line p-8 text-center">
          <h2 className="font-display text-2xl">
            No orders yet
          </h2>

          <p className="mt-3 text-muted">
            You haven't placed any orders.
          </p>

          <Link to="/shop" className="btn-primary mt-5">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-line p-6 shadow-soft"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl">
                    Order #{order.id}
                  </h2>

                  <p className="mt-2 text-sm text-muted">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                {/* <span className="rounded-full px-4 py-2 text-sm font-medium text-amber-800">
                  {order.status}
                </span>  this is status pending but i do not use*/}
              </div>

              <div className="mt-6 flex justify-between border-t border-line pt-4">
                <span className="font-medium">
                  Total Amount
                </span>

                <span className="font-semibold">
                  ${Number(order.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}