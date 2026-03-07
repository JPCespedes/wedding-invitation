import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Plus,
  Edit2,
  ChevronUp,
  ChevronDown,
  X,
  Trash2,
  UserPlus,
  UserMinus,
  UserCheck,
  Loader2,
  Users,
  ChevronsUpDown,
} from 'lucide-react'
import { useAdminData, type AdminRow, type RsvpStatus } from '../features/admin/useAdminData'
import {
  createInvitation,
  updateInvitation,
  deleteInvitation,
  upsertRsvp,
  clearRsvp,
  type InvitationRow,
} from '../features/admin/adminService'
import type { GuestEntry } from '../features/rsvp/rsvpSchema'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string

// ─── Password Gate ───────────────────────────────────────────────────────────

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', '1')
      onSuccess()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
        <h1 className="font-heading text-2xl text-stone-800 mb-2 text-center">Admin</h1>
        <p className="text-stone-500 text-sm text-center mb-6">
          Ingresá tu contraseña para continuar
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            placeholder="Contraseña"
            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition focus:ring-2 ${
              error
                ? 'border-red-400 focus:ring-red-200'
                : 'border-stone-200 focus:ring-dusty-200 focus:border-dusty-400'
            }`}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">Contraseña incorrecta</p>}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-dusty-600 text-white rounded-lg font-medium hover:bg-dusty-700 transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<RsvpStatus, { label: string; className: string }> = {
  confirmed: { label: 'Confirmado', className: 'bg-terra-100 text-terra-600' },
  declined: { label: 'Cancelado', className: 'bg-stone-100 text-stone-500' },
  pending: { label: 'Pendiente', className: 'bg-dusty-100 text-dusty-700' },
}

function StatusBadge({ status }: { status: RsvpStatus }) {
  const { label, className } = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

// ─── Invitation Modal ─────────────────────────────────────────────────────────

interface InvitationModalProps {
  initial: InvitationRow | null
  onClose: () => void
  onSaved: () => void
}

function InvitationModal({ initial, onClose, onSaved }: InvitationModalProps) {
  const isEdit = initial !== null
  const [code, setCode] = useState(initial?.code ?? '')
  const [guests, setGuests] = useState<string[]>(
    initial?.guests && initial.guests.length > 0 ? initial.guests : [''],
  )
  const [message, setMessage] = useState(initial?.message ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanGuests = guests.map((g) => g.trim()).filter(Boolean)
    if (!code.trim() || cleanGuests.length === 0) {
      setError('El código y al menos un invitado son requeridos')
      return
    }
    setIsSaving(true)
    setError(null)
    const result = isEdit
      ? await updateInvitation(initial!.id, cleanGuests, message)
      : await createInvitation(code.trim(), cleanGuests, message)
    setIsSaving(false)
    if (result.success) {
      onSaved()
    } else {
      setError(result.error ?? 'Error al guardar')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setIsDeleting(true)
    const result = await deleteInvitation(initial!.id, initial!.code)
    setIsDeleting(false)
    if (result.success) {
      onSaved()
    } else {
      setError(result.error ?? 'Error al eliminar')
      setConfirmDelete(false)
    }
  }

  const addGuest = () => setGuests([...guests, ''])
  const removeGuest = (i: number) => setGuests(guests.filter((_, idx) => idx !== i))
  const updateGuest = (i: number, val: string) =>
    setGuests(guests.map((g, idx) => (idx === i ? val : g)))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-xl text-stone-800">
            {isEdit ? 'Editar invitación' : 'Nueva invitación'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Código de invitación *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase().replace(/\s/g, ''))}
              disabled={isEdit}
              placeholder="ej: garcia"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-dusty-200 focus:border-dusty-400 transition disabled:bg-stone-50 disabled:text-stone-400"
            />
            {!isEdit && (
              <p className="text-xs text-stone-400 mt-1">
                Link de invitación: <strong>?invitacion={code || 'codigo'}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Invitados *
            </label>
            <div className="space-y-2">
              {guests.map((g, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={g}
                    onChange={(e) => updateGuest(i, e.target.value)}
                    placeholder={`Nombre completo ${i + 1}`}
                    className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-dusty-200 focus:border-dusty-400 transition text-sm"
                  />
                  {guests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGuest(i)}
                      className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addGuest}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-dusty-600 hover:text-dusty-700 transition"
            >
              <UserPlus size={15} />
              Agregar persona
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Mensaje personalizado
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Tu presencia es lo más importante. ¡No faltes!"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-dusty-200 focus:border-dusty-400 transition text-sm resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 bg-dusty-600 text-white rounded-lg font-medium hover:bg-dusty-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  confirmDelete
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'border border-red-200 text-red-500 hover:bg-red-50'
                }`}
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── RSVP Detail Modal ───────────────────────────────────────────────────────

interface RsvpDetailModalProps {
  row: AdminRow
  onClose: () => void
  onSaved: () => void
}

function RsvpDetailModal({ row, onClose, onSaved }: RsvpDetailModalProps) {
  const [guestList, setGuestList] = useState<GuestEntry[]>(() => {
    if (row.rsvp?.guests?.length) {
      return row.rsvp.guests as GuestEntry[]
    }
    return row.guests.map((name) => ({ name, attending: true, message: '' }))
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = (i: number) => {
    setGuestList((prev) =>
      prev.map((g, idx) =>
        idx === i ? { ...g, attending: !g.attending, message: g.attending ? '' : g.message } : g,
      ),
    )
  }

  const updateComment = (i: number, value: string) => {
    setGuestList((prev) =>
      prev.map((g, idx) => (idx === i ? { ...g, message: value } : g)),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    const result = await upsertRsvp(row.code, guestList)
    setIsSaving(false)
    if (result.success) {
      onSaved()
    } else {
      setError(result.error ?? 'Error al guardar')
    }
  }

  const handleClear = async () => {
    setIsClearing(true)
    setError(null)
    const result = await clearRsvp(row.code)
    setIsClearing(false)
    if (result.success) {
      onSaved()
    } else {
      setError(result.error ?? 'Error al limpiar')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-heading text-lg text-stone-800">Modificar RSVP</h3>
            <p className="text-xs text-stone-400 mt-0.5 font-mono">{row.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {guestList.map((guest, i) => (
            <div
              key={guest.name}
              className={`rounded-xl border p-4 transition-colors ${
                guest.attending
                  ? 'bg-stone-50 border-stone-200'
                  : 'bg-white border-stone-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-medium text-stone-800">{guest.name}</span>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
                    guest.attending
                      ? 'bg-terra-500 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {guest.attending ? (
                    <>
                      <UserCheck size={14} />
                      Asiste
                    </>
                  ) : (
                    <>
                      <UserMinus size={14} />
                      No asiste
                    </>
                  )}
                </button>
              </div>
              {guest.attending && (
                <input
                  type="text"
                  value={guest.message ?? ''}
                  onChange={(e) => updateComment(i, e.target.value)}
                  placeholder="Alergias o restricciones alimentarias"
                  className="w-full mt-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 bg-terra-500 text-white rounded-lg text-sm font-medium hover:bg-terra-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={15} className="animate-spin" />}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2.5 border border-stone-200 text-stone-500 rounded-lg text-sm font-medium hover:bg-stone-50 transition disabled:opacity-60 flex items-center gap-2"
            >
              {isClearing ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
              Limpiar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

type SortKey = 'code' | 'status' | 'guests'
type SortDir = 'asc' | 'desc'
type FilterMode = RsvpStatus | 'all' | 'attending_people' | 'not_attending_people'

const STATUS_ORDER: Record<RsvpStatus, number> = {
  confirmed: 0,
  declined: 1,
  pending: 2,
}

function SortIcon({
  active,
  dir,
}: {
  active: boolean
  dir: SortDir
}) {
  if (!active) return <ChevronsUpDown size={14} className="text-stone-300" />
  return dir === 'asc' ? (
    <ChevronUp size={14} className="text-dusty-600" />
  ) : (
    <ChevronDown size={14} className="text-dusty-600" />
  )
}

function AdminDashboard() {
  const { rows, isLoading, error, refresh } = useAdminData()

  const [filterStatus, setFilterStatus] = useState<FilterMode>('all')
  const [sortKey, setSortKey] = useState<SortKey>('code')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const [invitationModal, setInvitationModal] = useState<{
    open: boolean
    row: InvitationRow | null
  }>({ open: false, row: null })
  const [rsvpDetailModal, setRsvpDetailModal] = useState<{ open: boolean; row: AdminRow | null }>({
    open: false,
    row: null,
  })

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = rows.filter((r) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'attending_people')
      return (r.rsvp?.guests as GuestEntry[] ?? []).some((g) => g.attending)
    if (filterStatus === 'not_attending_people')
      return (r.rsvp?.guests as GuestEntry[] ?? []).some((g) => !g.attending)
    return r.status === filterStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'code') cmp = a.code.localeCompare(b.code)
    else if (sortKey === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    else if (sortKey === 'guests') cmp = a.guests.length - b.guests.length
    return sortDir === 'asc' ? cmp : -cmp
  })

  const pending = rows.filter((r) => r.status === 'pending').length
  const totalAttending = rows.reduce((acc, r) => {
    if (!r.rsvp) return acc
    return acc + (r.rsvp.guests as GuestEntry[]).filter((g) => g.attending).length
  }, 0)
  const totalNotAttending = rows.reduce((acc, r) => {
    if (!r.rsvp) return acc
    return acc + (r.rsvp.guests as GuestEntry[]).filter((g) => !g.attending).length
  }, 0)
  const totalInvited = rows.reduce((acc, r) => acc + r.guests.length, 0)
  const invWithAttending = rows.filter(
    (r) => r.rsvp && (r.rsvp.guests as GuestEntry[]).some((g) => g.attending),
  ).length
  const invWithNotAttending = rows.filter(
    (r) => r.rsvp && (r.rsvp.guests as GuestEntry[]).some((g) => !g.attending),
  ).length

  const handleModalSaved = () => {
    setInvitationModal({ open: false, row: null })
    setRsvpDetailModal({ open: false, row: null })
    refresh()
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl text-stone-800">Panel de Invitaciones</h1>
            <p className="text-stone-500 text-sm mt-0.5">Pablo & May · 29 enero 2027</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={isLoading}
              className="p-2.5 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 transition disabled:opacity-40"
              title="Refrescar"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => setInvitationModal({ open: true, row: null })}
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-dusty-600 text-white rounded-lg text-sm font-medium hover:bg-dusty-700 transition"
            >
              <Plus size={16} />
              Nueva invitación
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            {
              label: 'Total invitados',
              value: totalInvited,
              sub: `${rows.length} invitaciones`,
              icon: <Users size={18} />,
              className: 'text-stone-600 bg-white',
            },
            {
              label: 'Personas asisten',
              value: totalAttending,
              sub: `${invWithAttending} invitacion${invWithAttending !== 1 ? 'es' : ''}`,
              icon: <CheckCircle size={18} />,
              className: 'text-terra-600 bg-terra-50',
            },
            {
              label: 'Personas no asisten',
              value: totalNotAttending,
              sub: `${invWithNotAttending} invitacion${invWithNotAttending !== 1 ? 'es' : ''}`,
              icon: <XCircle size={18} />,
              className: 'text-stone-400 bg-white',
            },
            {
              label: 'Pendientes',
              value: pending,
              sub: 'sin respuesta',
              icon: <Clock size={18} />,
              className: 'text-dusty-600 bg-dusty-50',
            },
            {
              label: 'Sin confirmar',
              value: totalInvited - totalAttending - totalNotAttending,
              sub: 'personas',
              icon: <Users size={18} />,
              className: 'text-stone-500 bg-stone-50',
            },
          ].map(({ label, value, sub, icon, className }) => (
            <div
              key={label}
              className={`rounded-xl border border-stone-100 p-4 ${className}`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
              </div>
              <p className="font-heading text-3xl">{value}</p>
              <p className="text-xs opacity-60 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-stone-500 mr-1">Filtrar:</span>
          {(
            [
              { value: 'all', label: 'Todos' },
              { value: 'confirmed', label: 'Confirmados' },
              { value: 'declined', label: 'Cancelados' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'attending_people', label: 'Personas asisten' },
              { value: 'not_attending_people', label: 'Personas no asisten' },
            ] as { value: FilterMode; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterStatus(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterStatus === value
                  ? 'bg-dusty-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="text-stone-400 text-xs ml-auto">
            {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          {isLoading && rows.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-stone-400">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Cargando invitaciones...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm">
              No hay invitaciones{filterStatus !== 'all' ? ' con este filtro' : ''}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-left">
                    {(
                      [
                        { key: 'code', label: 'Código' },
                        { key: 'guests', label: 'Invitados' },
                        { key: null, label: 'Mensaje' },
                        { key: 'status', label: 'Estado' },
                        { key: null, label: 'Acciones' },
                      ] as { key: SortKey | null; label: string }[]
                    ).map(({ key, label }) => (
                      <th
                        key={label}
                        className={`px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide whitespace-nowrap ${
                          key ? 'cursor-pointer hover:text-stone-800 select-none' : ''
                        }`}
                        onClick={key ? () => handleSort(key) : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {label}
                          {key && (
                            <SortIcon active={sortKey === key} dir={sortDir} />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {sorted.map((row) => {
                    const attendingGuests =
                      row.rsvp?.guests.filter((g: GuestEntry) => g.attending) ?? []
                    const notAttending =
                      row.rsvp?.guests.filter((g: GuestEntry) => !g.attending) ?? []
                    return (
                      <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-stone-800 font-medium whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            {row.rsvp ? (
                              <>
                                {attendingGuests.map((g: GuestEntry) => (
                                  <div key={g.name} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-terra-400 shrink-0 mt-1.5" />
                                    <div>
                                      <span className="text-stone-700">{g.name}</span>
                                      {g.message && (
                                        <p className="text-xs text-dusty-600 bg-dusty-50 rounded px-1.5 py-0.5 mt-0.5 inline-block">
                                          {g.message}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {notAttending.map((g: GuestEntry) => (
                                  <div
                                    key={g.name}
                                    className="flex items-center gap-1.5"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                                    <span className="text-stone-400 line-through">{g.name}</span>
                                  </div>
                                ))}
                              </>
                            ) : (
                              row.guests.map((name) => (
                                <div key={name} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-200 shrink-0" />
                                  <span className="text-stone-600">{name}</span>
                                </div>
                              ))
                            )}
                          </div>
                          <p className="text-stone-400 text-xs mt-1">
                            {row.guests.length} persona{row.guests.length !== 1 ? 's' : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-stone-500 max-w-[160px]">
                          <span
                            className="block truncate"
                            title={row.message}
                          >
                            {row.message || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setInvitationModal({ open: true, row: row as InvitationRow })
                              }
                              className="p-2 rounded-lg text-stone-400 hover:text-dusty-600 hover:bg-dusty-50 transition"
                              title="Editar invitación"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRsvpDetailModal({ open: true, row })}
                              className="p-2 rounded-lg text-stone-400 hover:text-terra-600 hover:bg-terra-50 transition"
                              title="Modificar RSVP"
                            >
                              <CheckCircle size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {invitationModal.open && (
          <InvitationModal
            initial={invitationModal.row}
            onClose={() => setInvitationModal({ open: false, row: null })}
            onSaved={handleModalSaved}
          />
        )}
        {rsvpDetailModal.open && rsvpDetailModal.row && (
          <RsvpDetailModal
            row={rsvpDetailModal.row}
            onClose={() => setRsvpDetailModal({ open: false, row: null })}
            onSaved={handleModalSaved}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page Entry Point ─────────────────────────────────────────────────────────

export function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('admin-auth') === '1',
  )

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />
  return <AdminDashboard />
}
