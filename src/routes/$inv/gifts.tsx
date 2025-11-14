import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { GiftIcon } from 'lucide-react'

export const Route = createFileRoute('/$inv/gifts')({
  component: GiftsPage,
})

function GiftsPage() {
  const { inv } = Route.useParams()

  const tabs = [
    {
      id: '',
      label: 'Money Transfer',
      description: 'Manage money transfer options',
    },
    {
      id: 'package',
      label: 'Package Delivery',
      description: 'Manage package delivery options',
    },
  ]

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <GiftIcon size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Gifts</h1>
        </div>
        <p className="text-base-content/70 mb-8">
          Manage different gift options for your guests to choose from
        </p>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.id}
              from="/$inv/gifts"
              params={{ inv }}
              className="tab"
              activeProps={{
                className: 'tab tab-active text-lg font-bold underline-primary',
              }}
              activeOptions={{
                exact: tab.id === '',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-base-200 rounded-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
