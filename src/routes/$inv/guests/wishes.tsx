import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Heart, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { get } from '../../../lib/api'
import type { RsvpWithGuest } from '../../../types/rsvp'

export const Route = createFileRoute('/$inv/guests/wishes')({
  component: WishesPage,
})

function WishesPage() {
  const { inv } = Route.useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const {
    data: rsvps = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rsvps', inv],
    queryFn: () => get<Array<RsvpWithGuest>>({ path: `rsvp/${inv}` }),
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NotConfirmed: { class: 'badge-warning', label: 'Not Confirmed' },
      Attending: { class: 'badge-success', label: 'Attending' },
      Maybe: { class: 'badge-info', label: 'Maybe' },
      NotAttending: { class: 'badge-error', label: 'Not Attending' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  // Calculate stats
  const totalRsvps = rsvps.length
  const totalWishes = rsvps.filter(
    (rsvp) => rsvp.wish && rsvp.wish.trim() !== '',
  ).length

  // Pagination
  const totalPages = Math.ceil(rsvps.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedRsvps = rsvps.slice(startIndex, startIndex + pageSize)

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="skeleton h-8 w-48"></div>
          <div className="flex gap-4">
            <div className="skeleton h-16 w-24"></div>
            <div className="skeleton h-16 w-24"></div>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">
          <span>Error loading RSVPs: {error.message}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest RSVPs & Wishes</h2>
        <div className="flex items-center gap-4">
          <div className="stat bg-base-100 rounded-lg px-4 py-3">
            <div className="stat-title text-sm">Total RSVPs</div>
            <div className="stat-value text-primary text-xl">{totalRsvps}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg px-4 py-3">
            <div className="stat-title text-sm">Total Wishes</div>
            <div className="stat-value text-success text-xl">{totalWishes}</div>
          </div>
        </div>
      </div>

      {paginatedRsvps.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare
            size={64}
            className="mx-auto mb-4 text-base-content/50"
          />
          <p className="text-base-content/70 text-lg mb-4">No RSVPs yet</p>
          <p className="text-base-content/50 text-sm">
            Guest RSVPs and wishes will appear here once they start responding
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {paginatedRsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="card-title text-lg">{rsvp.guestName}</h3>
                      <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                        <Calendar size={14} />
                        <span>{formatDate(rsvp.createdAt)}</span>
                        <span className="badge badge-outline">
                          {rsvp.countGuests}{' '}
                          {rsvp.countGuests === 1 ? 'guest' : 'guests'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(rsvp.status)}
                    </div>
                  </div>

                  {rsvp.wish && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart size={16} className="text-primary" />
                        <span className="font-medium text-base-content/80">
                          Wish:
                        </span>
                      </div>
                      <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap bg-base-200 rounded-lg p-4">
                        {rsvp.wish}
                      </p>
                    </div>
                  )}

                  <div className="card-actions justify-end">
                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                      <span>RSVP Status: {rsvp.status}</span>
                      <span>•</span>
                      <span>
                        {rsvp.countGuests}{' '}
                        {rsvp.countGuests === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                className="btn btn-sm btn-ghost"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
