import { useState } from "react";
// import { Link, useNavigate } from 'react-router-dom' replace it to :
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../services/api";

export default function Auth({ register = false }) {
  const navigate = useNavigate();
  // after above add these 2 line:
  const location = useLocation();
  const from = location.state?.from;

  const title = register ? "Create your account" : "Welcome back";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      if (register) {
        // Register new customer
        response = await authApi.register({
          fullName,
          email,
          password,
        });

        setMessage(response.message || "Registration successful!");

        // Redirect to login after registration
        // setTimeout(() => {
        //   navigate('/login')
        // }, 1500) replace it to:
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { from },
          });
        }, 1500);
      } else {
        // Login existing customer
        response = await authApi.login({
          email,
          password,
        });

        // Save user information
        localStorage.setItem("user", JSON.stringify(response));

        setMessage(response.message || "Login successful!");

        // Redirect based on user role
        // setTimeout(() => {
        //   if (response.role === 'ADMIN') {
        //     navigate('/admin')
        //   } else {
        //     navigate('/')
        //   }
        // }, 1000) replace to :
        setTimeout(() => {
          if (response.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate(from || "/");
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please check your information and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-page flex min-h-[65vh] items-center justify-center py-14">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-line p-8 shadow-soft"
      >
        <p className="eyebrow text-center text-rose">Lumière account</p>

        <h1 className="mt-3 text-center font-display text-4xl">{title}</h1>

        <p className="mt-3 text-center text-sm text-muted">
          {register
            ? "Join us for your everyday beauty ritual."
            : "Sign in to view your account and orders."}
        </p>

        {register && (
          <input
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="field mt-7"
            placeholder="Full name"
          />
        )}

        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field mt-5"
          placeholder="Email address"
        />

        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field mt-3"
          placeholder="Password"
        />

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Please wait..." : register ? "Create account" : "Sign in"}
        </button>

        <p className="mt-5 text-center text-xs text-muted">
          {register ? "Already have an account?" : "New to Lumière?"}{" "}
          <Link
            className="font-semibold text-rose"
            to={register ? "/login" : "/register"}
            state={{ from }}
          >
            {register ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </form>
    </main>
  );
}
