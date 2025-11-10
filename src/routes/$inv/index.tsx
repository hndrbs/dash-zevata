import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle, Eye, Heart, Users } from 'lucide-react'
import { menuItems } from '../$inv'

export const Route = createFileRoute('/$inv/')({
  component: HomeDashboard,
})

function HomeDashboard() {
  const { inv } = Route.useParams()

  // Mock data for statistics - in real app, this would come from API
  const stats = [
    {
      label: 'View Count',
      value: '1,234',
      icon: Eye,
      color: 'bg-blue-500',
    },
    {
      label: 'Guest Invited',
      value: '89',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Guest Confirmation',
      value: '67',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      label: 'Wish Count',
      value: '45',
      icon: Heart,
      color: 'bg-pink-500',
    },
  ]

  // Filter out home menu item for the grid
  const gridMenuItems = menuItems.filter((item) => item.id !== '')

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Menu Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gridMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.id}
              from="/$inv"
              params={{ inv }}
              className="card bg-primary/5 hover:bg-base-300 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="card-body items-center text-center">
                <Icon size={32} className="mb-2 text-primary" />
                <h3 className="card-title text-lg">{item.label}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
