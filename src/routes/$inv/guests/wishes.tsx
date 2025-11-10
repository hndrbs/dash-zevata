import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Heart, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/guests/wishes')({
  component: WishesPage,
})

type Wish = {
  id: string
  guestName: string
  message: string
  date: string
  isPublic: boolean
  likes: number
}

function WishesPage() {
  const [wishes, setWishes] = useState<Array<Wish>>([
    {
      id: '1',
      guestName: 'John Doe',
      message:
        'Congratulations on your special day! Wishing you both a lifetime of love and happiness together. May your marriage be filled with endless joy and beautiful memories.',
      date: '2024-01-15',
      isPublic: true,
      likes: 5,
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      message:
        'So happy for you both! Your love story is truly inspiring. May your wedding day be as beautiful as your love for each other.',
      date: '2024-01-14',
      isPublic: true,
      likes: 3,
    },
    {
      id: '3',
      guestName: 'Michael Johnson',
      message:
        'Wishing you endless love and happiness as you begin this wonderful journey together. Congratulations on finding your perfect match!',
      date: '2024-01-13',
      isPublic: false,
      likes: 2,
    },
    {
      id: '4',
      guestName: 'Sarah Wilson',
      message:
        'May your love continue to grow with each passing day. Congratulations on your wedding! Looking forward to celebrating with you.',
      date: '2024-01-12',
      isPublic: true,
      likes: 7,
    },
    {
      id: '5',
      guestName: 'David Brown',
      message:
        'A perfect match made in heaven! Wishing you both all the happiness in the world as you start your new life together.',
      date: '2024-01-11',
      isPublic: true,
      likes: 4,
    },
  ])

  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')

  const filteredWishes = wishes.filter((wish) => {
    if (filter === 'all') return true
    if (filter === 'public') return wish.isPublic
    return !wish.isPublic
  })

  const handleTogglePublic = (id: string) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id ? { ...wish, isPublic: !wish.isPublic } : wish,
      ),
    )
  }

  const handleLike = (id: string) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id ? { ...wish, likes: wish.likes + 1 } : wish,
      ),
    )
  }

  const handleDeleteWish = (id: string) => {
    setWishes(wishes.filter((wish) => wish.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTotalLikes = () => {
    return wishes.reduce((total, wish) => total + wish.likes, 0)
  }

  const getPublicWishesCount = () => {
    return wishes.filter((wish) => wish.isPublic).length
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest Wishes</h2>
        <div className="flex items-center gap-4">
          <div className="stat bg-base-100 rounded-lg px-4 py-3">
            <div className="stat-title text-sm">Total Wishes</div>
            <div className="stat-value text-primary text-xl">
              {wishes.length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg px-4 py-3">
            <div className="stat-title text-sm">Total Likes</div>
            <div className="stat-value text-success text-xl">
              {getTotalLikes()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Wishes ({wishes.length})
        </button>
        <button
          className={`tab ${filter === 'public' ? 'tab-active' : ''}`}
          onClick={() => setFilter('public')}
        >
          Public ({getPublicWishesCount()})
        </button>
        <button
          className={`tab ${filter === 'private' ? 'tab-active' : ''}`}
          onClick={() => setFilter('private')}
        >
          Private ({wishes.length - getPublicWishesCount()})
        </button>
      </div>

      {filteredWishes.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare
            size={64}
            className="mx-auto mb-4 text-base-content/50"
          />
          <p className="text-base-content/70 text-lg mb-4">
            {filter === 'all'
              ? 'No wishes yet'
              : filter === 'public'
                ? 'No public wishes'
                : 'No private wishes'}
          </p>
          <p className="text-base-content/50 text-sm">
            Guest wishes will appear here once they start sending them
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredWishes.map((wish) => (
            <div
              key={wish.id}
              className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow ${
                !wish.isPublic ? 'border-l-4 border-l-warning' : ''
              }`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="card-title text-lg">{wish.guestName}</h3>
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                      <Calendar size={14} />
                      <span>{formatDate(wish.date)}</span>
                      {!wish.isPublic && (
                        <span className="badge badge-warning badge-sm">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(wish.id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <Heart
                        size={16}
                        className={wish.likes > 0 ? 'fill-current' : ''}
                      />
                      <span>{wish.likes}</span>
                    </button>
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-sm"
                      >
                        ⋮
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <button onClick={() => handleTogglePublic(wish.id)}>
                            {wish.isPublic ? 'Make Private' : 'Make Public'}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeleteWish(wish.id)}
                            className="text-error"
                          >
                            Delete Wish
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                  {wish.message}
                </p>

                <div className="card-actions justify-end mt-4">
                  <div className="flex items-center gap-4 text-sm text-base-content/60">
                    <span>{wish.likes} likes</span>
                    <span>•</span>
                    <span>{wish.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
