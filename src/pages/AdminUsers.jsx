import { useEffect, useMemo, useState } from 'react'
import { UserPlus, Search, ShieldCheck, Shield, UserRound, Ban, CheckCircle2, Trash2 } from 'lucide-react'

const seedUsers = [
  { id: 1, name: 'Olivia Martin', email: 'olivia@example.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Sophia Chen', email: 'sophia@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Amelia Johnson', email: 'amelia@example.com', role: 'Customer', status: 'Active' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lumiere-admin-users')) || seedUsers }
    catch { return seedUsers }
  })
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Admin' })
  const [message, setMessage] = useState('')

  useEffect(() => { localStorage.setItem('lumiere-admin-users', JSON.stringify(users)) }, [users])
  const filtered = useMemo(() => users.filter(user => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())), [users, query])

  const addUser = (event) => {
    event.preventDefault()
    if (users.some(user => user.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setMessage('An account with this email already exists.')
      return
    }
    setUsers(current => [{ id: Date.now(), name: form.name.trim(), email: form.email.trim(), role: form.role, status: 'Invited' }, ...current])
    setForm({ name: '', email: '', role: 'Admin' })
    setShowForm(false)
    setMessage('Demo account added. Connect the authentication API to send a real invitation.')
  }

  const updateUser = (id, changes) => setUsers(current => current.map(user => user.id === id ? { ...user, ...changes } : user))
  const removeUser = (id) => {
    if (window.confirm('Remove this account from the demo user list?')) setUsers(current => current.filter(user => user.id !== id))
  }

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow text-sage">Store access</p><h1 className="mt-2 font-display text-4xl text-wine">User management</h1><p className="mt-2 text-sm text-muted">Add administrators and manage account roles and access status.</p></div>
      <button onClick={() => { setShowForm(value => !value); setMessage('') }} className="btn-primary"><UserPlus size={16}/> Add user</button>
    </div>

    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-line bg-white p-5"><p className="text-xs text-muted">Total accounts</p><p className="mt-2 font-display text-3xl text-wine">{users.length}</p></div>
      <div className="rounded-2xl border border-line bg-white p-5"><p className="text-xs text-muted">Administrators</p><p className="mt-2 font-display text-3xl text-wine">{users.filter(user => user.role === 'Admin').length}</p></div>
      <div className="rounded-2xl border border-line bg-white p-5"><p className="text-xs text-muted">Active accounts</p><p className="mt-2 font-display text-3xl text-wine">{users.filter(user => user.status === 'Active').length}</p></div>
    </div>

    {showForm && <form onSubmit={addUser} className="mt-6 rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center justify-between"><div><h2 className="font-display text-2xl text-wine">Add an account</h2><p className="mt-1 text-xs text-muted">Create a demo customer or administrator entry.</p></div><button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted">Close</button></div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="text-xs font-semibold text-ink">Full name<input required className="field mt-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Morgan"/></label>
        <label className="text-xs font-semibold text-ink">Email address<input required type="email" className="field mt-2 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com"/></label>
        <label className="text-xs font-semibold text-ink">Role<select className="field mt-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="Admin">Admin</option><option value="Customer">Customer</option></select></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3"><button className="btn-primary">Save account</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button></div>
    </form>}

    {message && <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-sage">{message}</p>}

    <div className="mt-7">
      <label className="relative block w-full max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"/>
        <input className="field !h-12 !min-h-12 !rounded-xl !pl-11 !pr-4 text-sm leading-normal" placeholder="Search name, email or role" value={query} onChange={e => setQuery(e.target.value)}/>
      </label>
    </div>
    <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
      <div className="hidden grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)_minmax(135px,1fr)_112px] items-center gap-4 bg-cream px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted md:grid"><span>User</span><span>Email</span><span>Role</span><span>Status</span><span className="text-center">Actions</span></div>
      {filtered.map(user => <div key={user.id} className="grid gap-4 border-t border-line p-4 md:grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)_minmax(135px,1fr)_112px] md:items-center md:gap-4 md:px-5 md:py-5">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rose"><UserRound size={18}/></span><div><p className="text-sm font-semibold text-ink">{user.name}</p><p className="text-[11px] text-muted">Account #{user.id}</p></div></div>
        <span className="break-all text-xs text-muted">{user.email}</span>
        <label className="text-[10px] text-muted md:text-xs">Role<select aria-label={`Role for ${user.name}`} className="field mt-1 py-2 text-xs" value={user.role} onChange={e => updateUser(user.id, { role: e.target.value })}><option>Customer</option><option>Admin</option></select></label>
        <label className="text-[10px] text-muted md:text-xs">Status<select aria-label={`Status for ${user.name}`} className="field mt-1 py-2 text-xs" value={user.status} onChange={e => updateUser(user.id, { status: e.target.value })}><option>Active</option><option>Invited</option><option>Suspended</option></select></label>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <button onClick={() => updateUser(user.id, { status: user.status === 'Suspended' ? 'Active' : 'Suspended' })} title={user.status === 'Suspended' ? 'Activate account' : 'Suspend account'} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-sage transition hover:bg-blush">{user.status === 'Suspended' ? <CheckCircle2 size={17}/> : <Ban size={17}/>}</button>
          <button onClick={() => removeUser(user.id)} title="Remove account" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-rose transition hover:bg-blush"><Trash2 size={17}/></button>
        </div>
      </div>)}
      {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted">No matching accounts.</p>}
    </div>
    <p className="mt-4 rounded-xl border border-[#E8DED4] bg-[#F5F3E9] p-4 text-xs leading-6 text-muted"><strong className="text-wine">Demo limitation:</strong> This page stores sample account records in this browser only. It does not create real login credentials, send invitations, or enforce permissions. Before production, implement backend authentication, password hashing, role-based authorization and protected admin APIs.</p>
  </div>
}
