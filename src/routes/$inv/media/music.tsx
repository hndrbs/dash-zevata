import { createFileRoute } from '@tanstack/react-router'
import { Music, Play, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/media/music')({
  component: MusicPage,
})

type MusicTrack = {
  id: string
  title: string
  artist: string
  duration: string
  fileUrl: string
  isPlaying: boolean
}

function MusicPage() {
  const [tracks, setTracks] = useState<Array<MusicTrack>>([
    {
      id: '1',
      title: 'A Thousand Years',
      artist: 'Christina Perri',
      duration: '4:45',
      fileUrl: '#',
      isPlaying: false,
    },
    {
      id: '2',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      duration: '4:23',
      fileUrl: '#',
      isPlaying: false,
    },
    {
      id: '3',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      duration: '3:02',
      fileUrl: '#',
      isPlaying: false,
    },
  ])

  const handleAddTrack = () => {
    const newTrack: MusicTrack = {
      id: Date.now().toString(),
      title: `New Track ${tracks.length + 1}`,
      artist: 'Unknown Artist',
      duration: '0:00',
      fileUrl: '#',
      isPlaying: false,
    }
    setTracks([...tracks, newTrack])
  }

  const handleDeleteTrack = (id: string) => {
    setTracks(tracks.filter((track) => track.id !== id))
  }

  const handlePlayTrack = (id: string) => {
    setTracks(
      tracks.map((track) => ({
        ...track,
        isPlaying: track.id === id,
      })),
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wedding Music</h2>
        <button onClick={handleAddTrack} className="btn btn-primary">
          <Plus size={20} />
          Add Music
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-12">
          <Music size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            No music tracks yet
          </p>
          <button onClick={handleAddTrack} className="btn btn-primary">
            <Plus size={20} />
            Add Your First Track
          </button>
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-16"></th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Duration</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr
                    key={track.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td>
                      <button
                        onClick={() => handlePlayTrack(track.id)}
                        className={`btn btn-ghost btn-sm ${track.isPlaying ? 'text-primary' : ''}`}
                      >
                        <Play size={16} />
                      </button>
                    </td>
                    <td>
                      <div className="font-medium">{track.title}</div>
                    </td>
                    <td>
                      <div className="text-sm text-base-content/70">
                        {track.artist}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-base-content/70">
                        {track.duration}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
