import { createFileRoute } from '@tanstack/react-router'
import { Image, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/media/')({
  component: GalleriesPage,
})

type Gallery = {
  id: string
  name: string
  description: string
  imageCount: number
  coverImage: string
}

function GalleriesPage() {
  const [galleries, setGalleries] = useState<Array<Gallery>>([
    {
      id: '1',
      name: 'Engagement Photos',
      description: 'Our beautiful engagement photoshoot',
      imageCount: 24,
      coverImage:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Pre-Wedding',
      description: 'Pre-wedding photoshoot moments',
      imageCount: 36,
      coverImage:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Venue Tour',
      description: 'Photos from our wedding venue',
      imageCount: 18,
      coverImage:
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    },
  ])

  const handleAddGallery = () => {
    const newGallery: Gallery = {
      id: Date.now().toString(),
      name: `New Gallery ${galleries.length + 1}`,
      description: 'Add your gallery description here',
      imageCount: 0,
      coverImage:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    }
    setGalleries([...galleries, newGallery])
  }

  const handleDeleteGallery = (id: string) => {
    setGalleries(galleries.filter((gallery) => gallery.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Photo Galleries</h2>
        <button onClick={handleAddGallery} className="btn btn-primary">
          <Plus size={20} />
          Add Gallery
        </button>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <Image size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">No galleries yet</p>
          <button onClick={handleAddGallery} className="btn btn-primary">
            <Plus size={20} />
            Create Your First Gallery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <figure className="h-48">
                <img
                  src={gallery.coverImage}
                  alt={gallery.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg">{gallery.name}</h3>
                <p className="text-sm text-base-content/70">
                  {gallery.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-base-content/60">
                    {gallery.imageCount} photos
                  </span>
                  <button
                    onClick={() => handleDeleteGallery(gallery.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
