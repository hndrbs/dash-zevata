import { createFileRoute } from '@tanstack/react-router'
import { Music, Play, Plus, Search, Trash2, Upload, X } from 'lucide-react'
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
  fileName: string
  fileSize: string
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
      fileName: 'a_thousand_years.mp3',
      fileSize: '4.2 MB',
      isPlaying: false,
    },
    {
      id: '2',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      duration: '4:23',
      fileUrl: '#',
      fileName: 'perfect.mp3',
      fileSize: '3.8 MB',
      isPlaying: false,
    },
    {
      id: '3',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      duration: '3:02',
      fileUrl: '#',
      fileName: 'cant_help_falling.mp3',
      fileSize: '2.9 MB',
      isPlaying: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTrack = () => {
    setIsModalOpen(true)
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string

    if (!title || !artist || !selectedFile) {
      return
    }

    const newTrack: MusicTrack = {
      id: Date.now().toString(),
      title,
      artist,
      duration: '0:00',
      fileUrl: URL.createObjectURL(selectedFile),
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      isPlaying: false,
    }

    setTracks([...tracks, newTrack])
    setIsModalOpen(false)
    setSelectedFile(null)
    ;(event.target as HTMLFormElement).reset()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by title or artist..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTracks.length === 0 ? (
        <div className="text-center py-12">
          <Music size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            {searchTerm ? 'No music tracks found' : 'No music tracks yet'}
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
                  <th>File</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track) => (
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
                      <div className="text-xs">
                        <div className="font-medium">{track.fileName}</div>
                        <div className="text-base-content/60">
                          {track.fileSize}
                        </div>
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

      {/* Add Music Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Music Track</h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label block">
                      <span className="label-text">Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter song title"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label block">
                      <span className="label-text">Artist *</span>
                    </label>
                    <input
                      type="text"
                      name="artist"
                      placeholder="Enter artist name"
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label block">
                    <span className="label-text">Music File *</span>
                  </label>
                  <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center">
                    <Upload
                      size={48}
                      className="mx-auto mb-4 text-base-content/50"
                    />
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="file-input file-input-bordered w-full"
                      required
                    />
                    <p className="text-sm text-base-content/60 mt-2">
                      Supported formats: MP3, WAV, AAC, FLAC
                    </p>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-base-200 rounded-lg">
                        <p className="text-sm font-medium">
                          Selected: {selectedFile.name}
                        </p>
                        <p className="text-xs text-base-content/60">
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)}{' '}
                          MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
