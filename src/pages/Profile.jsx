import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Hash, LogOut, Mail, Phone } from 'lucide-react'
import { orderApi } from '../services/api'

// Adjust these paths to match your routes in App.jsx
const LOGIN_PATH = '/login'
const ORDERS_PATH = '/orders'
const SHOP_PATH = '/shop'

const SKIN_TYPES = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive']

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition ' +
  'focus:border-rose focus:ring-2 focus:ring-rose/30 aria-[invalid=true]:border-red-500 ' +
  'disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-muted'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const statusStyles = {
  paid: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
}

// Reads the signed-in user. A broken value in storage must not crash the page.
function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (parts[0][0] + last).toUpperCase()
}

function formatDate(value) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function validate(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Enter your full name.'
  if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone.trim()))
    errors.phone = 'Use digits only, for example +1 555 0123.'
  return errors
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-rose" />
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="break-words text-sm font-medium">{value || 'Not added'}</dd>
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(readStoredUser)
  const [form, setForm] = useState(() => ({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    skinType: user?.skinType ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [orders, setOrders] = useState([])
  const [ordersState, setOrdersState] = useState('loading') // loading, ready, error

  // Load the customer's recent orders with async/await
  useEffect(() => {
    if (!user) return undefined
    let cancelled = false

    async function loadOrders() {
      try {
        const data = await orderApi.getMyOrders()
        if (cancelled) return
        setOrders(Array.isArray(data) ? data : data?.orders ?? [])
        setOrdersState('ready')
      } catch {
        if (!cancelled) setOrdersState('error')
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  const firstName = (user.fullName || '').trim().split(/\s+/)[0] || 'there'
  const memberSince = formatDate(user.createdAt)

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // Saved in the browser for now. When the backend has an account endpoint,
    // send the same values with apiClient.put('/accounts/me', ...) first.
    const updated = {
      ...user,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      skinType: form.skinType,
    }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    setStatus('Your details are saved.')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate(LOGIN_PATH)
  }

  return (
    <main className="container-page min-h-[65vh] py-12">
      <p className="eyebrow text-rose">My account</p>
      <h1 className="mt-3 font-display text-4xl">Hello, {firstName}</h1>
      <p className="mt-2 text-muted">Manage your details and follow your orders.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[20rem_1fr]">
        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-line p-8 shadow-soft">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-rose font-display text-2xl text-white"
            >
              {initialsOf(user.fullName)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl">{user.fullName}</p>
              {memberSince && (
                <p className="text-xs text-muted">Member since {memberSince}</p>
              )}
            </div>
          </div>

          <dl className="mt-8 space-y-5 border-t border-line pt-6">
            <DetailRow icon={Hash} label="Customer ID" value={user.userId} />
            <DetailRow icon={Mail} label="Email address" value={user.email} />
            <DetailRow icon={Phone} label="Phone" value={user.phone} />
            {user.skinType && (
              <div className="pl-7">
                <dt className="text-xs text-muted">Skin type</dt>
                <dd className="text-sm font-medium">{user.skinType}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ORDERS_PATH} className="btn-primary">
              My orders
            </Link>
            <button type="button" onClick={handleLogout} className="btn-secondary inline-flex items-center gap-2">
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </div>
        </aside>

        <div className="space-y-12">
          {/* Details form */}
          <section aria-labelledby="details-heading">
            <h2 id="details-heading" className="font-display text-2xl">
              Personal details
            </h2>
            <p className="mt-1 text-sm text-muted">
              We use these details for your orders and delivery updates.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-2xl space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="profile-name" label="Full name" error={errors.fullName}>
                  <input
                    id="profile-name"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'profile-name-error' : undefined}
                    className={inputClass}
                  />
                </Field>

                <Field
                  id="profile-phone"
                  label="Phone"
                  error={errors.phone}
                  hint="Optional. Used only if there is a problem with delivery."
                >
                  <input
                    id="profile-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                id="profile-email"
                label="Email address"
                hint="Your email is your sign-in. Contact us if you need to change it."
              >
                <input
                  id="profile-email"
                  type="email"
                  value={user.email ?? ''}
                  disabled
                  className={inputClass}
                />
              </Field>

              <Field
                id="profile-skin"
                label="Skin type"
                hint="Optional. Helps us suggest products that suit you."
              >
                <select
                  id="profile-skin"
                  value={form.skinType}
                  onChange={handleChange('skinType')}
                  className={inputClass}
                >
                  <option value="">Prefer not to say</option>
                  {SKIN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-primary">
                  Save changes
                </button>
                <p role="status" className="text-sm text-rose">
                  {status}
                </p>
              </div>
            </form>
          </section>

          {/* Recent orders */}
          <section aria-labelledby="orders-heading" className="border-t border-line pt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 id="orders-heading" className="font-display text-2xl">
                Recent orders
              </h2>
              <Link
                to={ORDERS_PATH}
                className="inline-flex items-center gap-1 text-sm transition-colors hover:text-rose"
              >
                View all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6" aria-live="polite">
              {ordersState === 'loading' && (
                <p className="text-sm text-muted">Loading your orders...</p>
              )}

              {ordersState === 'error' && (
                <p className="text-sm text-muted">
                  We could not load your orders right now. Try again in a moment.
                </p>
              )}

              {ordersState === 'ready' && orders.length === 0 && (
                <div className="rounded-2xl border border-line p-8 text-center">
                  <p className="font-display text-xl">No orders yet</p>
                  <p className="mt-1 text-sm text-muted">
                    When you place an order, you can follow it here.
                  </p>
                  <Link to={SHOP_PATH} className="btn-primary mt-5 inline-block">
                    Start shopping
                  </Link>
                </div>
              )}

              {ordersState === 'ready' && orders.length > 0 && (
                <ul className="divide-y divide-line rounded-2xl border border-line">
                  {orders.slice(0, 3).map((order, index) => {
                    const id = order.id ?? order.orderId ?? index
                    const state = String(order.status ?? '')
                    const total = Number(order.total ?? order.totalAmount ?? 0)
                    return (
                      <li
                        key={id}
                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                      >
                        <div>
                          <p className="text-sm font-medium">Order #{id}</p>
                          <p className="text-xs text-muted">
                            {formatDate(order.createdAt ?? order.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {state && (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                statusStyles[state.toLowerCase()] ?? 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {state}
                            </span>
                          )}
                          <span className="text-sm font-medium">{money.format(total)}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}