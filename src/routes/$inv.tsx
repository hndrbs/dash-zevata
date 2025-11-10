import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Gift,
  Home,
  Image,
  Menu,
  Palette,
  Quote,
  User,
  Users,
  X,
} from 'lucide-react'

export const Route = createFileRoute('/$inv')({
  component: InvLayout,
})

const menuItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/$id' },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/$id/profile',
  },
  {
    id: 'events',
    label: 'Events',
    icon: Calendar,
    path: '/$id/events',
  },
  {
    id: 'guests',
    label: 'Guests',
    icon: Users,
    path: '/$id/guests',
  },
  {
    id: 'galleries',
    label: 'Galleries',
    icon: Image,
    path: '/$id/galleries',
  },
  {
    id: 'quotes',
    label: 'Quotes',
    icon: Quote,
    path: '/$id/quotes',
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: Palette,
    path: '/$id/themes',
  },
  { id: 'gifts', label: 'Gifts', icon: Gift, path: '/$id/gifts' },
  {
    id: 'stories',
    label: 'Stories',
    icon: BookOpen,
    path: '/$id/stories',
  },
]

export default function InvLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const { inv } = Route.useParams()

  const getActiveMenu = () => {
    const currentPath = location.pathname
    const activeItem = menuItems.find((item) => currentPath.includes(item.id))
    return activeItem?.id || 'home'
  }

  const activeMenu = getActiveMenu()

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Navigation */}
      <div className="navbar bg-base-100 shadow-sm border-b">
        <div className="flex-1">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="btn btn-ghost btn-square lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold ml-4"></h1>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />

        <div className="drawer-content flex flex-col">
          <Outlet />
        </div>

        <div className="drawer-side">
          <label
            htmlFor="dashboard-drawer"
            className="drawer-overlay"
            onClick={() => setIsDrawerOpen(false)}
          ></label>

          <div className="bg-base-200 min-h-screen w-80 p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Dashboard</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-ghost btn-square lg:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    params={{ inv }}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
