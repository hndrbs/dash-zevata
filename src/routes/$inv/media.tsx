import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Image, Music, Radio, Video } from 'lucide-react'

export const Route = createFileRoute('/$inv/media')({
  component: MediaPage,
})

function MediaPage() {
  const { inv } = Route.useParams()

  const tabs = [
    {
      id: '',
      label: 'Galleries',
      icon: Image,
    },
    {
      id: 'music',
      label: 'Music',
      icon: Music,
    },
    {
      id: 'video',
      label: 'Video',
      icon: Video,
    },
    {
      id: 'streaming',
      label: 'Streaming',
      icon: Radio,
    },
  ]

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Media</h1>
        <p className="text-base-content/70 mb-8">
          Manage your wedding media content
        </p>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.id}
                to={tab.id}
                from="/$inv/media"
                params={{ inv }}
                className="tab"
                activeProps={{ className: 'tab-active' }}
                activeOptions={{ exact: tab.id === '' }}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-base-200 rounded-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
