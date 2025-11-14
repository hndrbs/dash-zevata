import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  Edit,
  Filter,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { ZevataInput } from '../../../components/ZevataInput'
import { del, get, post, put } from '../../../lib/api'
import type { Guest } from '../../../types/guest'

export const Route = createFileRoute('/$inv/guests/')({
  component: GuestListPage,
})

function GuestListPage() {
  const { inv } = Route.useParams()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Pending' | 'Invited'
  >('all')

  const {
    data: guests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['guests', inv],
    queryFn: () => get<Array<Guest>>({ path: `guest/${inv}` }),
  })

  const createGuestMutation = useMutation({
    mutationFn: (guestData: Omit<Guest, 'id' | 'createdAt'>) =>
      post<Guest>(`guest/${inv}`, guestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', inv] })
      handleCloseModal()
    },
  })

  const updateGuestMutation = useMutation({
    mutationFn: (guestData: Guest) => put<Guest>(`guest/${inv}`, guestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', inv] })
      handleCloseModal()
    },
  })

  const deleteGuestMutation = useMutation({
    mutationFn: (id: string) => del(`guest/${inv}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', inv] })
    },
  })

  const handleAddGuest = () => {
    setEditingGuest(null)
    setIsModalOpen(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleDeleteGuest = (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      deleteGuestMutation.mutate(id)
    }
  }

  const handleSaveGuest = (guestData: Omit<Guest, 'id' | 'createdAt'>) => {
    if (editingGuest) {
      updateGuestMutation.mutate({
        ...guestData,
        id: editingGuest.id,
        createdAt: editingGuest.createdAt,
      })
    } else {
      createGuestMutation.mutate(guestData)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const handleWhatsAppClick = (phone?: string) => {
    if (!phone) return
    const message = 'Hello! This is regarding the wedding invitation.'
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCSVImport = (csvText: string) => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    const importedGuests: Array<Omit<Guest, 'id' | 'createdAt'>> = []

    for (let i = 1; i < lines.length; i++) {
      const [name, phone] = lines[i].split(',')
      if (name) {
        importedGuests.push({
          invId: inv,
          name: name.trim(),
          phone: phone ? phone.trim() : undefined,
        })
      }
    }

    // Import each guest individually
    importedGuests.forEach((guest) => {
      createGuestMutation.mutate(guest)
    })
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

  const getStatusBadge = (status: 'Pending' | 'Invited') => {
    const statusConfig = {
      Pending: { class: 'badge-warning', label: 'Pending' },
      Invited: { class: 'badge-success', label: 'Invited' },
    }
    const config = statusConfig[status]
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getStatusCounts = () => {
    const counts = {
      total: guests.length,
      invited: guests.filter((g) => g.invId === inv).length,
      pending: guests.filter((g) => g.invId === inv).length, // All guests are pending by default in new contract
    }
    return counts
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchTerm))

    const matchesStatus = statusFilter === 'all' || guest.invId === inv // Simplified status filter for new contract

    return matchesSearch && matchesStatus
  })

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-8 w-64 mb-2"></div>
          <div className="skeleton h-4 w-96 mb-8"></div>
          <div className="skeleton h-12 w-full mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24"></div>
            ))}
          </div>
          <div className="skeleton h-96"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <span>Error loading guests: {error.message}</span>
          </div>
        </div>
      </div>
    )
  }

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Total Guests</div>
          <div className="stat-value text-primary">{statusCounts.total}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Invited</div>
          <div className="stat-value text-success">{statusCounts.invited}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{statusCounts.pending}</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search */}
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

        {/* Status Filter */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
            size={20}
          />
          <select
            className="select select-bordered w-full pl-10"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'Pending' | 'Invited')
            }
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Invited">Invited</option>
          </select>
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No guests found'
              : 'No guests added yet'}
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
                    <td>
                      {guest.phone || (
                        <span className="text-base-content/50">No phone</span>
                      )}
                    </td>
                    <td>{getStatusBadge('Pending')}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWhatsAppClick(guest.phone)}
                          className={`btn btn-ghost btn-sm ${guest.phone ? 'text-success' : 'text-base-content/30 cursor-not-allowed'}`}
                          title={
                            guest.phone
                              ? 'Send WhatsApp Message'
                              : 'No phone number'
                          }
                          disabled={!guest.phone}
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
          onClose={handleCloseModal}
          isLoading={
            createGuestMutation.isPending || updateGuestMutation.isPending
          }
          inv={inv}
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
                  Upload a CSV file with columns: Name, Phone (optional)
                </p>
                <button
                  onClick={() => {
                    const csvContent =
                      'Name,Phone\nJohn Doe,+6281234567890\nJane Smith,+6281345678901\nFamily Group,'
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
  onSave: (guestData: Omit<Guest, 'id' | 'createdAt'>) => void
  onClose: () => void
  isLoading: boolean
}

function GuestModal({
  guest,
  onSave,
  onClose,
  isLoading,
  inv,
}: GuestModalProps & { inv: string }) {
  const form = useForm({
    defaultValues: {
      name: guest?.name || '',
      phone: guest?.phone || '',
    },
    onSubmit: ({ value }) => {
      if (!value.name.trim()) {
        return
      }
      onSave({
        ...value,
        invId: inv,
      })
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
            <div className="grid grid-cols-1 gap-4">
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
                children={(field) => (
                  <ZevataInput
                    field={field}
                    label="Phone Number"
                    type="tel"
                    placeholder="+6281234567890 (optional)"
                  />
                )}
              />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {guest ? 'Updating...' : 'Adding...'}
                </>
              ) : guest ? (
                'Update'
              ) : (
                'Add'
              )}{' '}
              Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
