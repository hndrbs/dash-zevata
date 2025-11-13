import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Calendar, Edit, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { del, get, post, put } from '../../lib/api'
import type { LoveStory } from '../../types/lovestory'

export const Route = createFileRoute('/$inv/stories')({
  component: StoriesPage,
})

function StoriesPage() {
  const { inv } = Route.useParams()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<LoveStory | null>(null)

  // Query for fetching love stories
  const {
    data: stories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lovestories', inv],
    queryFn: () => get<Array<LoveStory>>({ path: `lovestory/${inv}` }),
  })

  // Mutation for creating a love story
  const createMutation = useMutation({
    mutationFn: (storyData: Omit<LoveStory, 'id'>) =>
      post<LoveStory>(`lovestory/${inv}`, storyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lovestories', inv] })
      handleCloseModal()
    },
  })

  // Mutation for updating a love story
  const updateMutation = useMutation({
    mutationFn: ({
      storyId,
      storyData,
    }: {
      storyId: string
      storyData: Omit<LoveStory, 'id'>
    }) => put<LoveStory>(`lovestory/${inv}/${storyId}`, storyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lovestories', inv] })
      handleCloseModal()
    },
  })

  // Mutation for deleting a love story
  const deleteMutation = useMutation({
    mutationFn: (storyId: string) => del(`lovestory/${inv}/${storyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lovestories', inv] })
    },
  })

  const form = useForm({
    defaultValues: {
      title: '',
      storyContent: '',
      storyDate: new Date(),
      invId: inv,
      createdAt: new Date(),
    },
    onSubmit: ({ value }) => {
      const storyData = {
        ...value,
        storyDate: new Date(value.storyDate),
      }
      if (editingStory) {
        updateMutation.mutate({ storyId: editingStory.id, storyData })
      } else {
        createMutation.mutate(storyData)
      }
    },
  })

  const handleAddStory = () => {
    setEditingStory(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditStory = (story: LoveStory) => {
    setEditingStory(story)
    form.setFieldValue('title', story.title)
    form.setFieldValue('storyContent', story.storyContent)
    form.setFieldValue('storyDate', new Date(story.storyDate))
    setIsModalOpen(true)
  }

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this love story?')) {
      deleteMutation.mutate(storyId)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStory(null)
    form.reset()
  }

  const isMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading love stories: {error.message}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Our Love Stories
          </h1>
          <p className="text-gray-600 mt-2">
            Share and cherish your special moments together
          </p>
        </div>
        <button
          onClick={handleAddStory}
          className="btn btn-primary"
          disabled={isMutationLoading}
        >
          <Plus className="w-4 h-4" />
          Add Love Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No love stories yet
          </h3>
          <p className="text-gray-400 mb-4">
            Start documenting your beautiful journey together
          </p>
          <button
            onClick={handleAddStory}
            className="btn btn-primary"
            disabled={isMutationLoading}
          >
            <Plus className="w-4 h-4" />
            Create Your First Love Story
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {stories.map((story) => (
            <div key={story.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="card-title text-xl">{story.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(story.storyDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStory(story)}
                      className="btn btn-sm btn-outline"
                      disabled={isMutationLoading}
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="btn btn-sm btn-error"
                      disabled={isMutationLoading}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{story.storyContent}</p>
                </div>
                <div className="card-actions justify-end mt-4">
                  <div className="text-xs text-gray-400">
                    Created {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingStory ? 'Edit Love Story' : 'Add Love Story'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={isMutationLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="space-y-4">
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Title is required' : undefined,
                  }}
                >
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Title *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter a title for your love story..."
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
                </form.Field>

                <form.Field
                  name="storyDate"
                  validators={{
                    onChange: ({ value }) => {
                      const date =
                        value instanceof Date ? value : new Date(value)
                      return isNaN(date.getTime())
                        ? 'Story date is required'
                        : undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Story Date *</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={
                          field.state.value instanceof Date
                            ? field.state.value.toISOString().split('T')[0]
                            : new Date(field.state.value)
                                .toISOString()
                                .split('T')[0]
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(new Date(e.target.value))
                        }
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
                </form.Field>

                <form.Field
                  name="storyContent"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Story content is required' : undefined,
                  }}
                >
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Story Content *</span>
                      </label>
                      <textarea
                        placeholder="Share your beautiful story..."
                        className="textarea textarea-bordered h-32"
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
                </form.Field>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                  disabled={isMutationLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isMutationLoading || !form.state.canSubmit}
                >
                  {isMutationLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editingStory ? (
                    'Update Story'
                  ) : (
                    'Create Story'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
