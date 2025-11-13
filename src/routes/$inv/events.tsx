import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Calendar, Clock, Edit, MapPin, Plus, Trash2, X } from 'lucide-react'
import { ZevataInput } from '../../components/ZevataInput'
import { ZevataSelect } from '../../components/ZevataSelect'
import { ZevataTextArea } from '../../components/ZevataTextArea'
import { del, get, post, put } from '../../lib/api'
import type { Event as ApiEvent } from '../../types/event'

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
  const { inv } = Route.useParams()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Fetch events using TanStack Query
  const {
    data: events = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['events', inv],
    queryFn: () => get<Array<ApiEvent>>({ path: `event/${inv}` }),
  })

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (eventData: Omit<ApiEvent, 'id'>) =>
      post<ApiEvent>(`event/${inv}`, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', inv] })
      handleCloseModal()
    },
  })

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({
      eventId,
      eventData,
    }: {
      eventId: string
      eventData: Partial<ApiEvent>
    }) => put<ApiEvent>(`event/${inv}/${eventId}`, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', inv] })
      handleCloseModal()
    },
  })

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => del(`event/${inv}/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', inv] })
    },
  })

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
      const eventData = {
        invId: inv,
        eventName: value.title,
        eventDate: value.date,
        startTime: value.startTime,
        endTime: value.isIndefinite ? '' : value.endTime,
        venue: value.address.split(',')[0] || value.address,
        address: value.address,
        googleMapsUrl: value.mapLink,
        isMain: value.isMainEvent,
      }

      if (editingEvent) {
        // Update existing event
        updateEventMutation.mutate({
          eventId: editingEvent.id,
          eventData,
        })
      } else {
        // Add new event
        createEventMutation.mutate(eventData)
      }
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
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(eventId)
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg mx-auto mb-4"></span>
          <p>Loading events...</p>
        </div>
      </div>
    )
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-base-100 p-6 flex items-center justify-center">
        <div className="text-center text-error">
          <p>Error loading events: {queryError.message}</p>
        </div>
      </div>
    )
  }

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
        {events.map((apiEvent) => {
          // Convert API event to local event format
          const event: Event = {
            id: apiEvent.id,
            title: apiEvent.eventName,
            date: apiEvent.eventDate,
            startTime: apiEvent.startTime,
            endTime: apiEvent.endTime,
            isIndefinite: !apiEvent.endTime,
            timezone: 'Asia/Jakarta', // Default timezone
            address: apiEvent.address,
            mapLink: apiEvent.googleMapsUrl,
            isMainEvent: apiEvent.isMain,
          }

          return (
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
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
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
              <div className="space-y-4">
                {/* Text Inputs - Grid Layout */}
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
                      <ZevataInput
                        field={field}
                        label="Title"
                        type="text"
                        placeholder="Enter event title"
                        required
                      />
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
                      <ZevataInput
                        field={field}
                        label="Date"
                        type="date"
                        required
                      />
                    )}
                  />

                  {/* Timezone Field */}
                  <form.Field
                    name="timezone"
                    children={(field) => (
                      <ZevataSelect
                        field={field}
                        label="Timezone"
                        options={timezones}
                        placeholder="Select timezone..."
                      />
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
                      <ZevataInput
                        field={field}
                        label="Start Time"
                        type="time"
                        required
                      />
                    )}
                  />

                  {/* End Time Field */}
                  <form.Field
                    name="endTime"
                    children={(field) => (
                      <ZevataInput
                        field={field}
                        label="End Time"
                        type="time"
                        className="disabled:bg-base-300"
                      />
                    )}
                  />

                  {/* Indefinite Checkbox */}
                </div>

                {/* Checkboxes - Always Full Width */}
                <form.Field
                  name="isIndefinite"
                  children={(field) => (
                    <div className="form-control">
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
                {/* Textarea - Always Full Width */}
                <form.Field
                  name="address"
                  children={(field) => (
                    <ZevataTextArea
                      field={field}
                      label="Address"
                      placeholder="Enter event address"
                      rows={3}
                    />
                  )}
                />

                {/* Map Link Field */}
                {/* Text Inputs - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field
                    name="mapLink"
                    children={(field) => (
                      <ZevataInput
                        field={field}
                        label="Map Link"
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className="md:col-span-2"
                      />
                    )}
                  />
                </div>

                {/* Main Event Checkbox */}
                {/* Checkboxes - Always Full Width */}
                <form.Field
                  name="isMainEvent"
                  children={(field) => (
                    <div className="form-control">
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
                  disabled={
                    form.state.canSubmit === false ||
                    createEventMutation.isPending ||
                    updateEventMutation.isPending
                  }
                >
                  {createEventMutation.isPending ||
                  updateEventMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      {editingEvent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : editingEvent ? (
                    'Update'
                  ) : (
                    'Add'
                  )}{' '}
                  Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
