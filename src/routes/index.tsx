import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Users } from 'lucide-react'
import { get } from '../lib/api'
import LoadingSkeleton from '../components/LoadingSkeleton'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type InvType = {
  id: string
  slug: string
}

function HomePage() {
  const {
    data: invitations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['invitations'],
    queryFn: () =>
      get<Array<InvType>>({
        path: 'inv',
        pagination: { page: 0, pageSize: 9 },
      }),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">
              Wedding Invitations
            </h1>
            <p className="text-center text-lg opacity-70">
              Manage and view all wedding invitations
            </p>
          </div>
          <LoadingSkeleton size="lg" count={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading invitations: {error.message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Wedding Invitations
          </h1>
          <p className="text-center text-lg opacity-70">
            Manage and view all wedding invitations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations?.map((invitation) => (
            <div
              key={invitation.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="text-secondary" size={20} />
                    <div>
                      <p className="text-sm opacity-70">Slug</p>
                      <p className="font-mono text-sm">{invitation.slug}</p>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link
                    to="/$inv"
                    params={{ inv: invitation.id }}
                    className="btn btn-primary btn-sm"
                  >
                    <ExternalLink size={16} />
                    Manage Invitation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invitations?.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Users size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                No Invitations Found
              </h3>
              <p className="opacity-70">
                There are no invitations to display at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
