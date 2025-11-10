import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Check, Eye } from 'lucide-react'

export const Route = createFileRoute('/$inv/themes')({
  component: ThemesPage,
})

type Theme = {
  id: string
  name: string
  description: string
  imageUrl: string
  demoUrl: string
  category: string
  isSelected: boolean
}

function ThemesPage() {
  const [themes, setThemes] = useState<Array<Theme>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 6

  // Mock data for themes
  const mockThemes: Array<Theme> = [
    {
      id: '1',
      name: 'Classic Elegance',
      description:
        'A timeless and sophisticated theme with clean lines and elegant typography',
      imageUrl:
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/classic-elegance',
      category: 'Classic',
      isSelected: false,
    },
    {
      id: '2',
      name: 'Modern Minimalist',
      description:
        'Clean, contemporary design with plenty of white space and modern aesthetics',
      imageUrl:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/modern-minimalist',
      category: 'Modern',
      isSelected: true,
    },
    {
      id: '3',
      name: 'Romantic Garden',
      description:
        'Soft pastels, floral elements, and romantic typography for a dreamy feel',
      imageUrl:
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/romantic-garden',
      category: 'Romantic',
      isSelected: false,
    },
    {
      id: '4',
      name: 'Beach Wedding',
      description:
        'Coastal colors, sand textures, and ocean-inspired design elements',
      imageUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/beach-wedding',
      category: 'Outdoor',
      isSelected: false,
    },
    {
      id: '5',
      name: 'Vintage Charm',
      description:
        'Retro-inspired design with classic fonts and nostalgic color palette',
      imageUrl:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/vintage-charm',
      category: 'Vintage',
      isSelected: false,
    },
    {
      id: '6',
      name: 'Luxury Gold',
      description:
        'Opulent design with gold accents, rich colors, and premium typography',
      imageUrl:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/luxury-gold',
      category: 'Luxury',
      isSelected: false,
    },
    {
      id: '7',
      name: 'Rustic Country',
      description:
        'Warm, earthy tones with natural textures and country-inspired elements',
      imageUrl:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/rustic-country',
      category: 'Rustic',
      isSelected: false,
    },
    {
      id: '8',
      name: 'Boho Chic',
      description:
        'Free-spirited design with dreamcatchers, macrame, and earthy elements',
      imageUrl:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/boho-chic',
      category: 'Boho',
      isSelected: false,
    },
    {
      id: '9',
      name: 'Winter Wonderland',
      description:
        'Cool tones, snowflake patterns, and elegant winter-inspired design',
      imageUrl:
        'https://images.unsplash.com/photo-1452775339275-4d3d967743b1?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/winter-wonderland',
      category: 'Seasonal',
      isSelected: false,
    },
    {
      id: '10',
      name: 'Tropical Paradise',
      description:
        'Vibrant colors, tropical leaves, and exotic patterns for a fun celebration',
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/tropical-paradise',
      category: 'Tropical',
      isSelected: false,
    },
    {
      id: '11',
      name: 'Art Deco',
      description:
        'Geometric patterns, metallic accents, and 1920s-inspired elegance',
      imageUrl:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/art-deco',
      category: 'Vintage',
      isSelected: false,
    },
    {
      id: '12',
      name: 'Enchanted Forest',
      description:
        'Mystical forest elements, fairy lights, and magical typography',
      imageUrl:
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
      demoUrl: 'https://example.com/demo/enchanted-forest',
      category: 'Fantasy',
      isSelected: false,
    },
  ]

  // Load initial themes
  useEffect(() => {
    loadThemes(1)
  }, [])

  const loadThemes = async (page: number) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newThemes = mockThemes.slice(startIndex, endIndex)

    if (page === 1) {
      setThemes(newThemes)
    } else {
      setThemes((prev) => [...prev, ...newThemes])
    }

    setHasMore(endIndex < mockThemes.length)
    setIsLoading(false)
  }

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    loadThemes(nextPage)
  }

  const handleDemoClick = (demoUrl: string) => {
    window.open(demoUrl, '_blank', 'noopener,noreferrer')
  }

  const handleChooseTheme = (themeId: string) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) => ({
        ...theme,
        isSelected: theme.id === themeId,
      })),
    )
  }

  const getSelectedTheme = () => {
    return themes.find((theme) => theme.isSelected)
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Wedding Themes</h1>
        <p className="text-base-content/70 mb-8">
          Choose the perfect theme for your wedding website
        </p>

        {/* Selected Theme Banner */}
        {getSelectedTheme() && (
          <div className="alert alert-success mb-8">
            <Check size={20} />
            <div>
              <span className="font-medium">Selected Theme:</span>{' '}
              {getSelectedTheme()?.name}
            </div>
          </div>
        )}

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`card bg-base-200 shadow-sm hover:shadow-md transition-shadow ${
                theme.isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              <figure className="h-48">
                <img
                  src={theme.imageUrl}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
                {theme.isSelected && (
                  <div className="absolute top-2 right-2 badge badge-primary">
                    Selected
                  </div>
                )}
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg">{theme.name}</h3>
                  <span className="badge badge-outline badge-sm">
                    {theme.category}
                  </span>
                </div>
                <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                  {theme.description}
                </p>
                <div className="card-actions justify-between">
                  <button
                    onClick={() => handleDemoClick(theme.demoUrl)}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={16} />
                    Demo
                  </button>
                  <button
                    onClick={() => handleChooseTheme(theme.id)}
                    className={`btn btn-sm ${
                      theme.isSelected ? 'btn-success' : 'btn-primary'
                    }`}
                  >
                    {theme.isSelected ? (
                      <>
                        <Check size={16} />
                        Selected
                      </>
                    ) : (
                      'Choose Theme'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="btn btn-outline btn-wide"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Load More Themes'
              )}
            </button>
          </div>
        )}

        {/* No More Themes Message */}
        {!hasMore && themes.length > 0 && (
          <div className="text-center py-8">
            <p className="text-base-content/70">
              You've reached the end of available themes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
