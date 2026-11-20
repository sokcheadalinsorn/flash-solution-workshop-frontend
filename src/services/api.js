import axios from "axios";

// Base URL of the Java Spring Boot REST API.
// Change VITE_API_BASE_URL in the .env file when the backend is ready.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Create one Axios instance so all API requests share the same configuration.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Axios returns the response body inside response.data.
// async/await makes asynchronous HTTP requests easier to read.
export const productApi = {
  // GET /api/products
  async getAll() {
    try {
      const response = await apiClient.get("/products");
      return response.data;
    } catch (error) {
      console.error("Unable to load products:", error);
      throw error;
    }
  },

  // GET /api/products/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Unable to load product ${id}:`, error);
      throw error;
    }
  },

  // POST /api/products
  async create(productData) {
    try {
      const response = await apiClient.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Unable to create product:", error);
      throw error;
    }
  },

  // PUT /api/products/{id}
  async update(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Unable to update product ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/products/{id}
  delete: async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return true;
  },
};

export const brandApi = {
  // GET /api/brands
  async getAll() {
    try {
      const response = await apiClient.get("/brands");
      return response.data;
    } catch (error) {
      console.error("Unable to load brands:", error);
      throw error;
    }
  },
};

// Category API
export const categoryApi = {
  // GET /api/categories
  async getAll() {
    try {
      const response = await apiClient.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Unable to load categories:", error);
      throw error;
    }
  },
};


// I had replaced new update this a whole
export const authApi = {
  // POST /api/auth/login
  async login(credentials) {
    try {
      const response = await apiClient.post(
        "/auth/login",
        credentials,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // POST /api/auth/register
  async register(accountData) {
    try {
      const response = await apiClient.post(
        "/auth/register",
        accountData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // POST /api/auth/logout
  async logout() {
    const response = await apiClient.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );

    return response.data;
  },
};

// new add update code a whole
export const profileApi = {
  // GET /api/users/me
  async getMe() {
    const response = await apiClient.get("/users/me", {
      withCredentials: true,
    });

    return response.data;
  },

  // PUT /api/users/me
  async updateProfile(profileData) {
    const response = await apiClient.put(
      "/users/me",
      profileData,
      { withCredentials: true }
    );

    return response.data;
  },
};


// repalce all a wholde code 
export const orderApi = {
  // POST /api/orders
  async create(orderData) {
    try {
      const response = await apiClient.post(
        "/orders",
        orderData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.error("Unable to create order:", error);
      throw error;
    }
  },

  // GET /api/orders/my
  async getMyOrders() {
    try {
      const response = await apiClient.get(
        "/orders/my",
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.error("Unable to load orders:", error);
      throw error;
    }
  },
};

// Admin User Management API
export const userApi = {

  // GET all users
  async getAll(search = "") {
    const response = await apiClient.get("/users", {
      params: search ? { search } : {},
      withCredentials: true,
    });
    return response.data;
  },

  // GET user by ID
  async getById(id) {
    const response = await apiClient.get(`/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // POST create user
  async create(userData) {
    const response = await apiClient.post(
      "/users",
      userData,
      { withCredentials: true }
    );
    return response.data;
  },

  // PUT update user
  async update(id, userData) {
    const response = await apiClient.put(
      `/users/${id}`,
      userData,
      { withCredentials: true }
    );
    return response.data;
  },

  // PATCH update role
  async updateRole(id, role) {
    const response = await apiClient.patch(
      `/users/${id}/role`,
      { role },
      { withCredentials: true }
    );
    return response.data;
  },

  // PATCH update status
  async updateStatus(id, status) {
    const response = await apiClient.patch(
      `/users/${id}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  },

  // DELETE user
  async remove(id) {
    const response = await apiClient.delete(
      `/users/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },
};

export default apiClient;
