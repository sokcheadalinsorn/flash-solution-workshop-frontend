import { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Search,
  UserRound,
  Ban,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import { userApi } from "../services/api";

// Convert roles to the same format used by the backend.
const normalizeRole = (role) => {
  return role?.toUpperCase() === "ADMIN" ? "ADMIN" : "CUSTOMER";
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ADMIN",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load real users from the PostgreSQL database through the backend.
  const loadUsers = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await userApi.getAll();

      console.log("Users API response:", data);

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        setMessage("Unexpected response from Users API.");
      }
    } catch (error) {
      console.error("Users API error:", error);

      setMessage(
        `Unable to load users. HTTP Status: ${
          error.response?.status ?? "Network Error"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Load users when the page first opens.
  useEffect(() => {
    loadUsers();
  }, []);

  // Search the users already loaded from the backend.
  const filteredUsers = useMemo(() => {
    const searchText = query.toLowerCase().trim();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      const name = (user.name || user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        role.includes(searchText)
      );
    });
  }, [users, query]);

  // Refresh the users list after an operation.
  const refreshUsers = async () => {
    await loadUsers();
  };

  // Add a new user.
  const addUser = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await userApi.create({
        fullName: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: "Invited",
      });

      setForm({
        name: "",
        email: "",
        role: "ADMIN",
      });

      setShowForm(false);
      setMessage("User created successfully.");

      await refreshUsers();
    } catch (error) {
      console.error("Unable to create user:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create user. The email may already exist.",
      );
    }
  };

  // Update a user's role.
  const updateRole = async (id, role) => {
    setMessage("");

    try {
      await userApi.updateRole(id, role);

      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, role } : user)),
      );

      setMessage("User role updated successfully.");
    } catch (error) {
      console.error("Unable to update role:", error);
      setMessage("Unable to update user role.");
    }
  };

  // Update a user's status.
  const updateStatus = async (id, status) => {
    setMessage("");

    try {
      await userApi.updateStatus(id, status);

      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, status } : user)),
      );

      setMessage("User status updated successfully.");
    } catch (error) {
      console.error("Unable to update status:", error);
      setMessage("Unable to update user status.");
    }
  };

  // Delete a user.
  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this account?")) {
      return;
    }

    setMessage("");

    try {
      await userApi.remove(id);

      setUsers((current) => current.filter((user) => user.id !== id));

      setMessage("User deleted successfully.");
    } catch (error) {
      console.error("Unable to delete user:", error);
      setMessage("Unable to delete user.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-sage">Store access</p>
          <h1 className="mt-2 font-display text-4xl text-wine">
            User management
          </h1>
          <p className="mt-2 text-sm text-muted">
            Add administrators and manage account roles and access status.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm((value) => !value);
            setMessage("");
          }}
          className="btn-primary"
        >
          <UserPlus size={16} /> Add user
        </button>
      </div>

      {/* User summary */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs text-muted">Total accounts</p>
          <p className="mt-2 font-display text-3xl text-wine">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs text-muted">Administrators</p>
          <p className="mt-2 font-display text-3xl text-wine">
            {
              users.filter((user) => normalizeRole(user.role) === "ADMIN")
                .length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs text-muted">Active accounts</p>
          <p className="mt-2 font-display text-3xl text-wine">
            {
              users.filter((user) => user.status?.toLowerCase() === "active")
                .length
            }
          </p>
        </div>
      </div>

      {/* Add user form */}
      {showForm && (
        <form
          onSubmit={addUser}
          className="mt-6 rounded-2xl border border-line bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-wine">
                Add an account
              </h2>
              <p className="mt-1 text-xs text-muted">
                Create a customer or administrator entry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-muted"
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="text-xs font-semibold text-ink">
              Full name
              <input
                required
                className="field mt-2 text-sm"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Alex Morgan"
              />
            </label>

            <label className="text-xs font-semibold text-ink">
              Email address
              <input
                required
                type="email"
                className="field mt-2 text-sm"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="name@example.com"
              />
            </label>

            <label className="text-xs font-semibold text-ink">
              Role
              <select
                className="field mt-2 text-sm"
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
              >
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Save account
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Success and error messages */}
      {message && (
        <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-sage">
          {message}
        </p>
      )}

      {/* Search */}
      <div className="mt-7">
        <label className="relative block w-full max-w-xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            className="field !h-12 !min-h-12 !rounded-xl !pl-11 !pr-4 text-sm leading-normal"
            placeholder="Search name, email or role"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {/* Users table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)_minmax(135px,1fr)_112px] items-center gap-4 bg-cream px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted md:grid">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span className="text-center">Actions</span>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-muted">
            Loading users...
          </p>
        ) : (
          <>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid gap-4 border-t border-line p-4 md:grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)_minmax(135px,1fr)_112px] md:items-center md:gap-4 md:px-5 md:py-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rose">
                    <UserRound size={18} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {user.name || user.fullName}
                    </p>
                    <p className="text-[11px] text-muted">Account #{user.id}</p>
                  </div>
                </div>

                <span className="break-all text-xs text-muted">
                  {user.email}
                </span>

                <label className="text-[10px] text-muted md:text-xs">
                  Role
                  <select
                    aria-label={`Role for ${user.name || user.fullName}`}
                    className="field mt-1 py-2 text-xs"
                    value={normalizeRole(user.role)}
                    onChange={(event) =>
                      updateRole(user.id, event.target.value)
                    }
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </label>

                <label className="text-[10px] text-muted md:text-xs">
                  Status
                  <select
                    aria-label={`Status for ${user.name || user.fullName}`}
                    className="field mt-1 py-2 text-xs"
                    value={user.status}
                    onChange={(event) =>
                      updateStatus(user.id, event.target.value)
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Invited">Invited</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </label>

                <div className="flex items-center justify-start gap-2 md:justify-center">
                  <button
                    onClick={() =>
                      updateStatus(
                        user.id,
                        user.status === "Suspended" ? "Active" : "Suspended",
                      )
                    }
                    title={
                      user.status === "Suspended"
                        ? "Activate account"
                        : "Suspend account"
                    }
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-sage transition hover:bg-blush"
                  >
                    {user.status === "Suspended" ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Ban size={17} />
                    )}
                  </button>

                  <button
                    onClick={() => removeUser(user.id)}
                    title="Remove account"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-rose transition hover:bg-blush"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="p-10 text-center text-sm text-muted">
                No matching accounts.
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-4 rounded-xl border border-[#E8DED4] bg-[#F5F3E9] p-4 text-xs leading-6 text-muted">
        <strong className="text-wine">Important:</strong> New users created from
        this page receive an Invited status. This does not create login
        credentials or send an invitation email. Registered customers are loaded
        from the backend database.
      </p>
    </div>
  );
}
