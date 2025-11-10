import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Plus, Radio, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/media/streaming')({
  component: StreamingPage,
})

type StreamingService = {
  id: string
  name: string
  platform: string
  streamUrl: string
  description: string
  isActive: boolean
}

function StreamingPage() {
  const [streams, setStreams] = useState<Array<StreamingService>>([
    {
      id: '1',
      name: 'YouTube Live',
      platform: 'YouTube',
      streamUrl: 'https://youtube.com/live/your-stream-id',
      description: 'Main wedding ceremony live stream',
      isActive: true,
    },
    {
      id: '2',
      name: 'Zoom Meeting',
      platform: 'Zoom',
      streamUrl: 'https://zoom.us/j/your-meeting-id',
      description: 'Virtual guest participation',
      isActive: false,
    },
    {
      id: '3',
      name: 'Facebook Live',
      platform: 'Facebook',
      streamUrl: 'https://facebook.com/your-page/live',
      description: 'Social media live stream',
      isActive: false,
    },
  ])

  const handleAddStream = () => {
    const newStream: StreamingService = {
      id: Date.now().toString(),
      name: `New Stream ${streams.length + 1}`,
      platform: 'Custom Platform',
      streamUrl: 'https://example.com/your-stream',
      description: 'Add your stream description here',
      isActive: false,
    }
    setStreams([...streams, newStream])
  }

  const handleDeleteStream = (id: string) => {
    setStreams(streams.filter((stream) => stream.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setStreams(
      streams.map((stream) => ({
        ...stream,
        isActive: stream.id === id,
      })),
    )
  }

  const handleOpenStream = (streamUrl: string) => {
    window.open(streamUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Live Streaming</h2>
        <button onClick={handleAddStream} className="btn btn-primary">
          <Plus size={20} />
          Add Stream
        </button>
      </div>

      {streams.length === 0 ? (
        <div className="text-center py-12">
          <Radio size={64} className="mx-auto mb-4 text-base-content/50" />
          <p className="text-base-content/70 text-lg mb-4">
            No streaming services configured
          </p>
          <button onClick={handleAddStream} className="btn btn-primary">
            <Plus size={20} />
            Add Your First Stream
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow ${stream.isActive ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="card-title text-lg">{stream.name}</h3>
                    <div className="badge badge-outline mt-1">
                      {stream.platform}
                    </div>
                  </div>
                  {stream.isActive && (
                    <div className="badge badge-primary">Active</div>
                  )}
                </div>

                <p className="text-sm text-base-content/70 mb-4">
                  {stream.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">Stream URL:</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">
                      {stream.streamUrl}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenStream(stream.streamUrl)}
                      className="btn btn-outline btn-sm"
                    >
                      <ExternalLink size={16} />
                      Open
                    </button>
                    <button
                      onClick={() => handleToggleActive(stream.id)}
                      className={`btn btn-sm ${stream.isActive ? 'btn-success' : 'btn-outline'}`}
                    >
                      {stream.isActive ? 'Active' : 'Set Active'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteStream(stream.id)}
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
