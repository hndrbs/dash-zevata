import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Calendar, Edit, Plus, Trash2, X } from 'lucide-react'
import PhotoUpload from '../../components/PhotoUpload'

export const Route = createFileRoute('/$inv/stories')({
  component: StoriesPage,
})

type Story = {
  id: string
  title: string
  content: string
  date: string
  coverImageUrl?: string
  coverImageFile?: File | null
}

function StoriesPage() {
  const [stories, setStories] = useState<Array<Story>>([
    {
      id: '1',
      title: 'Pertemuan Pertama',
      content:
        'Kami pertama kali bertemu di kampus pada tahun 2018. Saat itu kami sedang mengikuti kegiatan organisasi mahasiswa dan langsung merasa ada chemistry yang spesial.',
      date: '2018-01-01',
      coverImageUrl:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      title: 'Tunangan',
      content:
        'Setelah 3 tahun menjalin hubungan, akhirnya kami memutuskan untuk bertunangan pada bulan November 2021. Momen ini sangat berarti bagi kami dan keluarga.',
      date: '2021-11-01',
      coverImageUrl:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      title: 'Hari Bahagia',
      content:
        'Akhirnya tiba juga hari yang kami tunggu-tunggu. Dengan restu dari kedua orang tua, kami akan melangsungkan pernikahan pada tanggal 25 Desember 2024. Semoga menjadi awal dari kehidupan berumah tangga yang penuh berkah.',
      date: '2024-12-25',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      date: '',
      coverImageUrl: '',
      coverImageFile: null as File | null,
    },
    onSubmit: async ({ value }) => {
      // If there's a cover image file to upload, handle it first
      let coverImageUrl = value.coverImageUrl

      if (value.coverImageFile) {
        try {
          setIsUploading(true)
          setUploadError(null)
          coverImageUrl = await uploadToCloudflareR2(value.coverImageFile)
        } catch (error) {
          setUploadError(
            error instanceof Error ? error.message : 'Upload failed',
          )
          setIsUploading(false)
          return
        }
      }

      if (editingStory) {
        // Update existing story
        setStories(
          stories.map((s) =>
            s.id === editingStory.id
              ? {
                  ...value,
                  coverImageUrl,
                  id: editingStory.id,
                }
              : s,
          ),
        )
      } else {
        // Add new story
        const newStory: Story = {
          ...value,
          coverImageUrl,
          id: Date.now().toString(),
          coverImageFile: null,
        }
        setStories([...stories, newStory])
      }
      setIsUploading(false)
      handleCloseModal()
    },
  })

  const handleAddStory = () => {
    setEditingStory(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditStory = (story: Story) => {
    setEditingStory(story)
    form.setFieldValue('title', story.title)
    form.setFieldValue('content', story.content)
    form.setFieldValue('date', story.date)
    form.setFieldValue('coverImageUrl', story.coverImageUrl || '')
    form.setFieldValue('coverImageFile', null)
    setIsModalOpen(true)
  }

  const handleDeleteStory = (storyId: string) => {
    setStories(stories.filter((s) => s.id !== storyId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStory(null)
    setIsUploading(false)
    setUploadError(null)
    form.reset()
  }

  // Get presigned URL from backend
  const getPresignedUrl = async (
    fileName: string,
    contentType: string,
  ): Promise<string> => {
    const response = await fetch('/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        contentType,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get presigned URL')
    }

    const data = await response.json()
    return data.url
  }

  // Upload to Cloudflare R2 using presigned URL
  const uploadToCloudflareR2 = async (file: File): Promise<string> => {
    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `stories/${timestamp}-${Math.random().toString(36).substring(2)}.webp`

    // Get presigned URL
    const presignedUrl = await getPresignedUrl(fileName, 'image/webp')

    // Upload to R2
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    // Extract the public URL from presigned URL (remove query parameters)
    return presignedUrl.split('?')[0]
  }

  const handlePhotoProcessed = (file: File) => {
    form.setFieldValue('coverImageFile', file)
    form.setFieldValue('coverImageUrl', '') // Clear existing URL if any
  }

  const handlePhotoError = (error: string) => {
    setUploadError(error)
  }

  const formatStoryDate = (story: Story) => {
    try {
      const date = new Date(story.date)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      return story.date
    } catch {
      return story.date
    }
  }

  const validateDate = (date: string): string | undefined => {
    if (!date) return 'Date is required'

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return 'Invalid date format. Use YYYY-MM-DD'
    }

    const testDate = new Date(date)
    if (isNaN(testDate.getTime())) {
      return 'Invalid date'
    }

    return undefined
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Stories</h1>
        <button onClick={handleAddStory} className="btn btn-primary">
          <Plus size={20} />
          Add Story
        </button>
      </div>

      {/* Stories List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="card bg-base-200 shadow-sm">
            {story.coverImageUrl && (
              <figure className="h-48">
                <img
                  src={story.coverImageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title text-lg">{story.title}</h3>

              <div className="flex items-center gap-2 text-sm text-base-content/70 mb-3">
                <Calendar size={16} />
                <span>{formatStoryDate(story)}</span>
              </div>

              <p className="text-sm line-clamp-3 mb-4">{story.content}</p>

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEditStory(story)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStory(story.id)}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Story Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingStory ? 'Edit Story' : 'Add Story'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title Field */}
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Title is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label block">
                        <span className="label-text">Title *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter story title"
                        className="input input-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />
                {/* Date Field */}
                <form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) => validateDate(value),
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label block">
                        <span className="label-text">Date *</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />

                {/* Content Field */}
                <form.Field
                  name="content"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Content is required'
                      if (value.length < 20) return 'Content is too short'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control md:col-span-2">
                      <label className="label block">
                        <span className="label-text">Story Content *</span>
                      </label>
                      <textarea
                        placeholder="Tell your story..."
                        className="textarea textarea-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={6}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {field.state.meta.errors.join(', ')}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                />

                {/* Cover Image Upload */}
                <div className="form-control md:col-span-2">
                  <label className="label block">
                    <span className="label-text">Cover Image</span>
                  </label>
                  <PhotoUpload
                    onFileProcessed={handlePhotoProcessed}
                    onError={handlePhotoError}
                    maxSize={5 * 1024 * 1024} // 5MB
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  />
                  {uploadError && (
                    <div className="mt-2">
                      <p className="text-sm text-error">{uploadError}</p>
                    </div>
                  )}
                  {form.state.values.coverImageUrl &&
                    !form.state.values.coverImageFile && (
                      <div className="mt-2">
                        <p className="text-sm text-success">
                          Current cover image URL:{' '}
                          {form.state.values.coverImageUrl}
                        </p>
                      </div>
                    )}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={form.state.canSubmit === false || isUploading}
                >
                  {editingStory ? 'Update' : 'Add'} Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
