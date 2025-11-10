import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { MessageSquare, Users } from 'lucide-react'

export const Route = createFileRoute('/$inv/guests')({
  component: GuestsPage,
})

function GuestsPage() {
  const { inv } = Route.useParams()
  const currentPath = useLocation().pathname

  const tabs = [
    {
      id: '',
      label: 'Guest List',
      icon: Users,
      path: '/$inv/guests',
    },
    {
      id: 'wishes',
      label: 'Wishes',
      icon: MessageSquare,
      path: '/$inv/guests/wishes',
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
        <h1 className="text-3xl font-bold mb-2">Guests</h1>
        <p className="text-base-content/70 mb-8">
          Manage your wedding guests and their wishes
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
