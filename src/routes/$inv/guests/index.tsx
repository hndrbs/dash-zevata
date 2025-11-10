import { createFileRoute } from '@tanstack/react-router'
import { Check, Edit, Plus, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/guests/')({
  component: GuestListPage,
})

type Guest = {
  id: string
  name: string
  email: string
  phone: string
  group: string
  status: 'invited' | 'confirmed' | 'declined'
  plusOne: boolean
  dietaryRestrictions: string
}

function GuestListPage() {
  const [guests, setGuests] = useState<Array<Guest>>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+62 812-3456-7890',
      group: 'Bride Family',
      status: 'confirmed',
      plusOne: true,
      dietaryRestrictions: 'Vegetarian',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+62 813-4567-8901',
      group: 'Groom Friends',
      status: 'invited',
      plusOne: false,
      dietaryRestrictions: '',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael@example.com',
      phone: '+62 814-5678-9012',
      group: 'Work Colleagues',
      status: 'declined',
      plusOne: false,
      dietaryRestrictions: 'No seafood',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  const handleAddGuest = () => {
    setEditingGuest(null)
    setIsModalOpen(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id))
  }

  const handleSaveGuest = (guestData: Omit<Guest, 'id'>) => {
    if (editingGuest) {
      setGuests(
        guests.map((g) =>
          g.id === editingGuest.id ? { ...guestData, id: editingGuest.id } : g,
        ),
      )
    } else {
      const newGuest: Guest = {
        ...guestData,
        id: Date.now().toString(),
      }
      setGuests([...guests, newGuest])
    }
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const getStatusBadge = (status: Guest['status']) => {
    const statusConfig = {
      invited: { class: 'badge-warning', label: 'Invited' },
      confirmed: { class: 'badge-success', label: 'Confirmed' },
      declined: { class: 'badge-error', label: 'Declined' },
    }
    const config = statusConfig[status]
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getStatusCounts = () => {
    const counts = {
      total: guests.length,
      confirmed: guests.filter((g) => g.status === 'confirmed').length,
      invited: guests.filter((g) => g.status === 'invited').length,
      declined: guests.filter((g) => g.status === 'declined').length,
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest List</h2>
        <button onClick={handleAddGuest} className="btn btn-primary">
          <Plus size={20} />
          Add Guest
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Total Guests</div>
          <div className="stat-value text-primary">{statusCounts.total}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Confirmed</div>
          <div className="stat-value text-success">
            {statusCounts.confirmed}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Invited</div>
          <div className="stat-value text-warning">{statusCounts.invited}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Declined</div>
          <div className="stat-value text-error">{statusCounts.declined}</div>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            No guests added yet
          </p>
          <button onClick={handleAddGuest} className="btn btn-primary">
            <Plus size={20} />
            Add Your First Guest
          </button>
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th>Plus One</th>
                  <th className="w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td>
                      <div className="font-medium">{guest.name}</div>
                      {guest.dietaryRestrictions && (
                        <div className="text-xs text-base-content/60">
                          {guest.dietaryRestrictions}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-sm">{guest.email}</div>
                      <div className="text-xs text-base-content/60">
                        {guest.phone}
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-outline">{guest.group}</div>
                    </td>
                    <td>{getStatusBadge(guest.status)}</td>
                    <td>
                      {guest.plusOne ? (
                        <Check size={16} className="text-success" />
                      ) : (
                        <X size={16} className="text-base-content/40" />
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGuest(guest)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Guest Modal */}
      {isModalOpen && (
        <GuestModal
          guest={editingGuest}
          onSave={handleSaveGuest}
          onClose={() => {
            setIsModalOpen(false)
            setEditingGuest(null)
          }}
        />
      )}
    </div>
  )
}

type GuestModalProps = {
  guest: Guest | null
  onSave: (guestData: Omit<Guest, 'id'>) => void
  onClose: () => void
}

function GuestModal({ guest, onSave, onClose }: GuestModalProps) {
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    group: guest?.group || 'Friends',
    status: guest?.status || 'invited',
    plusOne: guest?.plusOne || false,
    dietaryRestrictions: guest?.dietaryRestrictions || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {guest ? 'Edit Guest' : 'Add Guest'}
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label block">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                placeholder="+62 812-3456-7890"
                className="input input-bordered"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Group</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
              >
                <option value="Bride Family">Bride Family</option>
                <option value="Groom Family">Groom Family</option>
                <option value="Friends">Friends</option>
                <option value="Work Colleagues">Work Colleagues</option>
                <option value="Relatives">Relatives</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as Guest['status'])
                }
              >
                <option value="invited">Invited</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={formData.plusOne}
                  onChange={(e) => handleChange('plusOne', e.target.checked)}
                />
                <span className="label-text">Plus One Allowed</span>
              </label>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label block">
                <span className="label-text">Dietary Restrictions</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Vegetarian, No seafood, Gluten-free"
                className="input input-bordered"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  handleChange('dietaryRestrictions', e.target.value)
                }
              />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {guest ? 'Update' : 'Add'} Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
