import { createFileRoute } from '@tanstack/react-router'
import { Play, Plus, Trash2, Video } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/media/video')({
  component: VideoPage,
})

type VideoItem = {
  id: string
  title: string
  description: string
  duration: string
  thumbnailUrl: string
  videoUrl: string
  uploadDate: string
}

function VideoPage() {
  const [videos, setVideos] = useState<Array<VideoItem>>([
    {
      id: '1',
      title: 'Our Love Story',
      description: 'A beautiful compilation of our journey together',
      duration: '3:45',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
      videoUrl: '#',
      uploadDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Engagement Video',
      description: 'The magical moment we got engaged',
      duration: '2:30',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
      videoUrl: '#',
      uploadDate: '2024-01-10',
    },
    {
      id: '3',
      title: 'Venue Tour',
      description: 'A walkthrough of our wedding venue',
      duration: '5:15',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      videoUrl: '#',
      uploadDate: '2024-01-05',
    },
  ])

  const handleAddVideo = () => {
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: `New Video ${videos.length + 1}`,
      description: 'Add your video description here',
      duration: '0:00',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      videoUrl: '#',
      uploadDate: new Date().toISOString().split('T')[0],
    }
    setVideos([...videos, newVideo])
  }

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  const handlePlayVideo = (videoUrl: string) => {
    // In a real app, this would open the video player
    console.log('Playing video:', videoUrl)
    alert('Video playback would start here')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wedding Videos</h2>
        <button onClick={handleAddVideo} className="btn btn-primary">
          <Plus size={20} />
          Add Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Video size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">No videos yet</p>
          <button onClick={handleAddVideo} className="btn btn-primary">
            <Plus size={20} />
            Upload Your First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <figure className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayVideo(video.videoUrl)}
                    className="btn btn-primary btn-circle"
                  >
                    <Play size={24} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg">{video.title}</h3>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-base-content/60">
                    {video.uploadDate}
                  </span>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
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
