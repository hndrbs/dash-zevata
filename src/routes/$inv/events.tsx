import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Calendar, Clock, Edit, MapPin, Plus, Trash2, X } from 'lucide-react'

export const Route = createFileRoute('/$inv/events')({
  component: EventsPage,
})

type Event = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  isIndefinite: boolean
  timezone: string
  address: string
  mapLink: string
  isMainEvent: boolean
}

function EventsPage() {
  const [events, setEvents] = useState<Array<Event>>([
    {
      id: '1',
      title: 'Akad Nikah',
      date: '2024-12-25',
      startTime: '08:00',
      endTime: '10:00',
      isIndefinite: false,
      timezone: 'Asia/Jakarta',
      address: 'Masjid Agung Surakarta, Jl. Slamet Riyadi, Surakarta',
      mapLink: 'https://maps.google.com/?q=Masjid+Agung+Surakarta',
      isMainEvent: true,
    },
    {
      id: '2',
      title: 'Resepsi',
      date: '2024-12-25',
      startTime: '18:00',
      endTime: '',
      isIndefinite: true,
      timezone: 'Asia/Jakarta',
      address: 'Ballroom Hotel Santika, Jl. Gatot Subroto, Surakarta',
      mapLink: 'https://maps.google.com/?q=Hotel+Santika+Surakarta',
      isMainEvent: false,
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const form = useForm({
    defaultValues: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      isIndefinite: false,
      timezone: 'Asia/Jakarta',
      address: '',
      mapLink: '',
      isMainEvent: false,
    },
    onSubmit: ({ value }) => {
      if (editingEvent) {
        // Update existing event
        setEvents(
          events.map((e) =>
            e.id === editingEvent.id ? { ...value, id: editingEvent.id } : e,
          ),
        )
      } else {
        // Add new event
        const newEvent: Event = {
          ...value,
          id: Date.now().toString(),
        }
        setEvents([...events, newEvent])
      }
      handleCloseModal()
    },
  })

  const handleAddEvent = () => {
    setEditingEvent(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    form.setFieldValue('title', event.title)
    form.setFieldValue('date', event.date)
    form.setFieldValue('startTime', event.startTime)
    form.setFieldValue('endTime', event.endTime)
    form.setFieldValue('isIndefinite', event.isIndefinite)
    form.setFieldValue('timezone', event.timezone)
    form.setFieldValue('address', event.address)
    form.setFieldValue('mapLink', event.mapLink)
    form.setFieldValue('isMainEvent', event.isMainEvent)
    setIsModalOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
    form.reset()
  }

  const timezones = [
    { value: 'Asia/Jakarta', label: 'WIB (UTC+7)' },
    { value: 'Asia/Makassar', label: 'WITA (UTC+8)' },
    { value: 'Asia/Jayapura', label: 'WIT (UTC+9)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'UTC+1', label: 'UTC+1' },
    { value: 'UTC+2', label: 'UTC+2' },
    { value: 'UTC+3', label: 'UTC+3' },
    { value: 'UTC+4', label: 'UTC+4' },
    { value: 'UTC+5', label: 'UTC+5' },
    { value: 'UTC+6', label: 'UTC+6' },
    { value: 'UTC+7', label: 'UTC+7' },
    { value: 'UTC+8', label: 'UTC+8' },
    { value: 'UTC+9', label: 'UTC+9' },
    { value: 'UTC+10', label: 'UTC+10' },
    { value: 'UTC+11', label: 'UTC+11' },
    { value: 'UTC+12', label: 'UTC+12' },
    { value: 'UTC-1', label: 'UTC-1' },
    { value: 'UTC-2', label: 'UTC-2' },
    { value: 'UTC-3', label: 'UTC-3' },
    { value: 'UTC-4', label: 'UTC-4' },
    { value: 'UTC-5', label: 'UTC-5' },
    { value: 'UTC-6', label: 'UTC-6' },
    { value: 'UTC-7', label: 'UTC-7' },
    { value: 'UTC-8', label: 'UTC-8' },
    { value: 'UTC-9', label: 'UTC-9' },
    { value: 'UTC-10', label: 'UTC-10' },
    { value: 'UTC-11', label: 'UTC-11' },
    { value: 'UTC-12', label: 'UTC-12' },
  ]

  const formatEventTime = (event: Event) => {
    const startTime = event.startTime
    let endTime = event.endTime

    if (event.isIndefinite) {
      endTime = 'Sampai Selesai'
    }

    return `${startTime} - ${endTime}`
  }
  console.log(form.state.values.isIndefinite)
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <button onClick={handleAddEvent} className="btn btn-primary">
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="card-title text-lg flex items-center gap-2">
                    {event.title}
                    {event.isMainEvent && (
                      <span className="badge badge-primary">Main Event</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                    <Calendar size={16} />
                    <span>
                      {new Date(event.date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                    <Clock size={16} />
                    <span>
                      {formatEventTime(event)} ({event.timezone})
                    </span>
                  </div>
                </div>
              </div>

              {event.address && (
                <div className="flex items-start gap-2 text-sm mb-3">
                  <MapPin size={16} className="mt-0.5" />
                  <span>{event.address}</span>
                </div>
              )}

              {event.mapLink && (
                <div className="mb-4">
                  <a
                    href={event.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View on Map
                  </a>
                </div>
              )}

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm"
              >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title Field */}
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Title is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label block">
                        <span className="label-text">Title *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter event title"
                        className="input input-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />

                {/* Date Field */}
                <form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Date is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date *</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />

                {/* Timezone Field */}
                <form.Field
                  name="timezone"
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Timezone</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />

                {/* Start Time Field */}
                <form.Field
                  name="startTime"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Start time is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Start Time *</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />

                {/* End Time Field */}
                <form.Field
                  name="endTime"
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">End Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered disabled:bg-base-300"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={form.state.values.isIndefinite}
                      />
                    </div>
                  )}
                />

                {/* Indefinite Checkbox */}
                <form.Field
                  name="isIndefinite"
                  children={(field) => (
                    <div className="form-control md:col-span-2">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />
                        <span className="label-text">Until finished</span>
                      </label>
                    </div>
                  )}
                />

                {/* Address Field */}
                <form.Field
                  name="address"
                  children={(field) => (
                    <div className="form-control col-span-2">
                      <label className="label block">
                        <span className="label-text">Address</span>
                      </label>
                      <textarea
                        placeholder="Enter event address"
                        className="textarea textarea-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                />

                {/* Map Link Field */}
                <form.Field
                  name="mapLink"
                  children={(field) => (
                    <div className="form-control md:col-span-2">
                      <label className="label block">
                        <span className="label-text">Map Link</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className="input input-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                {/* Main Event Checkbox */}
                <form.Field
                  name="isMainEvent"
                  children={(field) => (
                    <div className="form-control md:col-span-2">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />
                        <span className="label-text font-medium">
                          Mark as Main Event
                        </span>
                      </label>
                    </div>
                  )}
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={form.state.canSubmit === false}
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
