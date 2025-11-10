import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { Image, Music, Radio, Video } from 'lucide-react'

export const Route = createFileRoute('/$inv/media')({
  component: MediaPage,
})

function MediaPage() {
  const { inv } = Route.useParams()
  const currentPath = useLocation().pathname

  const tabs = [
    {
      id: '',
      label: 'Galleries',
      icon: Image,
      path: '/$inv/media',
    },
    {
      id: 'music',
      label: 'Music',
      icon: Music,
      path: '/$inv/media/music',
    },
    {
      id: 'video',
      label: 'Video',
      icon: Video,
      path: '/$inv/media/video',
    },
    {
      id: 'streaming',
      label: 'Streaming',
      icon: Radio,
      path: '/$inv/media/streaming',
    },
  ]

  const getActiveTab = () => {
    return (
      tabs.find((tab) => currentPath === tab.path.replace('$inv', inv))?.id ||
      ''
    )
  }

  const activeTab = getActiveTab()

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
            const isActive = activeTab === tab.id

            return (
              <Link
                key={tab.id}
                to={tab.path}
                params={{ inv }}
                className={`tab ${isActive ? 'tab-active' : ''}`}
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
