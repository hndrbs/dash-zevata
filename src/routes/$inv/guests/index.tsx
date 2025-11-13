import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Edit,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { ZevataInput } from '../../../components/ZevataInput'
import { ZevataSelect } from '../../../components/ZevataSelect'

export const Route = createFileRoute('/$inv/guests/')({
  component: GuestListPage,
})

type Guest = {
  id: string
  name: string
  phone: string
  status: 'invited' | 'confirmed' | 'maybe' | 'declined'
}

function GuestListPage() {
  const [guests, setGuests] = useState<Array<Guest>>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+6281234567890',
      status: 'confirmed',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+6281345678901',
      status: 'invited',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      phone: '+6281456789012',
      status: 'maybe',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      phone: '+6281567890123',
      status: 'declined',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

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

  const handleWhatsAppClick = (phone: string) => {
    const message = 'Hello! This is regarding the wedding invitation.'
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCSVImport = (csvText: string) => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    const importedGuests: Array<Guest> = []

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const [name, phone] = lines[i].split(',')
      if (name && phone) {
        importedGuests.push({
          id: Date.now().toString() + i,
          name: name.trim(),
          phone: phone.trim(),
          status: 'invited',
        })
      }
    }

    setGuests([...guests, ...importedGuests])
    setIsImportModalOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string
        handleCSVImport(csvText)
      }
      reader.readAsText(file)
    }
  }

  const getStatusBadge = (status: Guest['status']) => {
    const statusConfig = {
      invited: { class: 'badge-warning', label: 'Invited' },
      confirmed: { class: 'badge-success', label: 'Confirmed' },
      maybe: { class: 'badge-info', label: 'Maybe' },
      declined: { class: 'badge-error', label: 'Not Coming' },
    }
    const config = statusConfig[status]
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getStatusCounts = () => {
    const counts = {
      total: guests.length,
      confirmed: guests.filter((g) => g.status === 'confirmed').length,
      maybe: guests.filter((g) => g.status === 'maybe').length,
      declined: guests.filter((g) => g.status === 'declined').length,
    }
    return counts
  }

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm),
  )

  const statusCounts = getStatusCounts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest List</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn btn-outline"
          >
            <Plus size={16} />
            Import CSV
          </button>
          <button onClick={handleAddGuest} className="btn btn-primary">
            <Plus size={20} />
            Add Guest
          </button>
        </div>
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
          <div className="stat-title">Maybe</div>
          <div className="stat-value text-info">{statusCounts.maybe}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Not Coming</div>
          <div className="stat-value text-error">{statusCounts.declined}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            {searchTerm ? 'No guests found' : 'No guests added yet'}
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
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th className="w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="font-medium">{guest.name}</td>
                    <td>{guest.phone}</td>
                    <td>{getStatusBadge(guest.status)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWhatsAppClick(guest.phone)}
                          className="btn btn-ghost btn-sm text-success"
                          title="Send WhatsApp Message"
                        >
                          <MessageCircle size={16} />
                        </button>
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

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Import Guests from CSV</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-base-content/70">
                  Upload a CSV file with columns: Name, Phone
                </p>
                <button
                  onClick={() => {
                    const csvContent =
                      'Name,Phone\nJohn Doe,+6281234567890\nJane Smith,+6281345678901'
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'guests_example.csv'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Download Example CSV
                </button>
              </div>
              <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center">
                <Upload
                  size={48}
                  className="mx-auto mb-4 text-base-content/50"
                />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered w-full"
                />
                <p className="text-sm text-base-content/60 mt-2">
                  Supported format: CSV with Name,Phone columns
                </p>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
  const form = useForm({
    defaultValues: {
      name: guest?.name || '',
      phone: guest?.phone || '',
      status: guest?.status || 'invited',
    },
    onSubmit: ({ value }) => {
      if (!value.name.trim() || !value.phone.trim()) {
        return
      }
      onSave(value)
    },
  })

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {guest ? 'Edit Guest' : 'Add Guest'}
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-4">
            {/* Text Inputs - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Name is required' : undefined,
                }}
                children={(field) => (
                  <ZevataInput
                    field={field}
                    label="Name"
                    type="text"
                    placeholder="Full name"
                    required
                  />
                )}
              />

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Phone number is required' : undefined,
                }}
                children={(field) => (
                  <ZevataInput
                    field={field}
                    label="Phone Number"
                    type="tel"
                    placeholder="+6281234567890"
                    required
                  />
                )}
              />

              <form.Field
                name="status"
                children={(field) => (
                  <ZevataSelect
                    field={field}
                    label="Status"
                    options={[
                      { value: 'invited', label: 'Invited' },
                      { value: 'confirmed', label: 'Confirmed' },
                      { value: 'maybe', label: 'Maybe' },
                      { value: 'declined', label: 'Not Coming' },
                    ]}
                    className="md:col-span-2"
                  />
                )}
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
