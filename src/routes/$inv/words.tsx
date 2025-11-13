import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, Plus, Quote, Trash2, X } from 'lucide-react'
import { del, get, post, put } from '../../lib/api'
import { ZevataInput } from '../../components/ZevataInput'
import { ZevataSelect } from '../../components/ZevataSelect'
import { ZevataTextArea } from '../../components/ZevataTextArea'
import type { Word, WordType } from '../../types/word'

export const Route = createFileRoute('/$inv/words')({
  component: QuotesPage,
})

function QuotesPage() {
  const { inv } = Route.useParams()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<Word | null>(null)

  // Query for fetching words
  const {
    data: words = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['words', inv],
    queryFn: () =>
      get<Array<any>>({ path: `word/${inv}` }).then((data) =>
        data.map((item: any) => ({
          id: item.id,
          content: item.content,
          author: item.author || undefined,
          title: item.title || undefined,
          type: numberToWordType(item.type),
        })),
      ),
  })

  // Mutation for creating a word
  const createMutation = useMutation({
    mutationFn: (wordData: Omit<Word, 'id'>) =>
      post<any>(`word/${inv}`, {
        author: wordData.author || null,
        content: wordData.content,
        title: wordData.title || null,
        type: wordTypeToNumber(wordData.type),
      }).then((data) => ({
        id: data.id,
        content: data.content,
        author: data.author || undefined,
        title: data.title || undefined,
        type: numberToWordType(data.type),
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words', inv] })
      handleCloseModal()
    },
  })

  // Mutation for updating a word
  const updateMutation = useMutation({
    mutationFn: ({
      wordId,
      wordData,
    }: {
      wordId: string
      wordData: Omit<Word, 'id'>
    }) =>
      put<any>(`word/${inv}/${wordId}`, {
        author: wordData.author || null,
        content: wordData.content,
        title: wordData.title || null,
        type: wordTypeToNumber(wordData.type),
      }).then((data) => ({
        id: data.id,
        content: data.content,
        author: data.author || undefined,
        title: data.title || undefined,
        type: numberToWordType(data.type),
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words', inv] })
      handleCloseModal()
    },
  })

  // Mutation for deleting a word
  const deleteMutation = useMutation({
    mutationFn: (wordId: string) => del(`word/${inv}/${wordId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words', inv] })
    },
  })

  const form = useForm({
    defaultValues: {
      content: '',
      author: '',
      title: '',
      type: 'Quote' as WordType,
    },
    onSubmit: ({ value }) => {
      if (editingWord) {
        updateMutation.mutate({ wordId: editingWord.id, wordData: value })
      } else {
        createMutation.mutate(value)
      }
    },
  })

  const handleAddWord = () => {
    setEditingWord(null)
    form.reset()
    setIsModalOpen(true)
  }

  // Helper functions for Word type conversion
  const wordTypeToNumber = (type: WordType): number => {
    switch (type) {
      case 'Opening':
        return 1
      case 'Quote':
        return 2
      case 'Closing':
        return 3
      default:
        return 2 // Default to Quote
    }
  }

  const numberToWordType = (type: number): WordType => {
    switch (type) {
      case 1:
        return 'Opening'
      case 2:
        return 'Quote'
      case 3:
        return 'Closing'
      default:
        return 'Quote'
    }
  }

  const handleEditWord = (word: Word) => {
    setEditingWord(word)
    form.setFieldValue('content', word.content)
    form.setFieldValue('author', word.author || '')
    form.setFieldValue('title', word.title || '')
    form.setFieldValue('type', word.type)
    setIsModalOpen(true)
  }

  const handleDeleteWord = (wordId: string) => {
    deleteMutation.mutate(wordId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingWord(null)
    form.reset()
  }

  const typeOptions: Array<WordType> = ['Opening', 'Quote', 'Closing']

  const getTypeBadgeColor = (type: WordType) => {
    switch (type) {
      case 'Opening':
        return 'badge-primary'
      case 'Quote':
        return 'badge-secondary'
      case 'Closing':
        return 'badge-accent'
      default:
        return 'badge-neutral'
    }
  }

  const isMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Words</h1>
        <button
          onClick={handleAddWord}
          className="btn btn-primary"
          disabled={isMutationLoading}
        >
          <Plus size={20} />
          Add Word
        </button>
      </div>

      {(error ||
        createMutation.error ||
        updateMutation.error ||
        deleteMutation.error) && (
        <div className="alert alert-error mb-6">
          <span>Failed to load words. Please try again.</span>
          <button
            onClick={() => {
              // Clear errors
              queryClient.invalidateQueries({ queryKey: ['words', inv] })
            }}
            className="btn btn-ghost btn-sm"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-base-content/70">Loading words...</p>
        </div>
      ) : (
        <>
          {/* Words List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {words.map((word) => (
              <div key={word.id} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-3 mb-4">
                    <Quote size={20} className="text-primary mt-1" />
                    <div className="flex-1">
                      {word.title && (
                        <h3 className="font-semibold text-lg mb-2">
                          {word.title}
                        </h3>
                      )}
                      <p className="text-base italic mb-3">"{word.content}"</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {word.author && (
                          <p className="font-medium text-sm">{word.author}</p>
                        )}
                        <span
                          className={`badge badge-sm ${getTypeBadgeColor(word.type)}`}
                        >
                          {word.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleEditWord(word)}
                      className="btn btn-ghost btn-sm"
                      disabled={isMutationLoading}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWord(word.id)}
                      className="btn btn-ghost btn-sm text-error"
                      disabled={isMutationLoading}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {words.length === 0 && !error && (
            <div className="text-center py-12">
              <Quote size={64} className="mx-auto mb-4 text-base-content/50" />
              <p className="text-base-content/70 text-lg mb-4">
                No words added yet
              </p>
              <button
                onClick={handleAddWord}
                className="btn btn-primary"
                disabled={isMutationLoading}
              >
                <Plus size={20} />
                Add Your First Word
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Word Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingWord ? 'Edit Word' : 'Add Word'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm"
                disabled={isMutationLoading}
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
              <div className="space-y-4">
                {/* Text Inputs - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type Field */}
                  <form.Field
                    name="type"
                    children={(field) => (
                      <ZevataSelect
                        field={field}
                        label="Type"
                        options={typeOptions.map((type) => ({
                          value: type,
                          label: type,
                        }))}
                        placeholder="Select type..."
                        required
                      />
                    )}
                  />

                  {/* Title Field */}
                  <form.Field
                    name="title"
                    children={(field) => (
                      <ZevataInput
                        field={field}
                        label="Title"
                        type="text"
                        placeholder="Enter title (optional)"
                      />
                    )}
                  />

                  {/* Author Field */}
                  <form.Field
                    name="author"
                    children={(field) => (
                      <ZevataInput
                        field={field}
                        label="Author"
                        type="text"
                        placeholder="Enter author name (optional)"
                      />
                    )}
                  />
                </div>

                {/* Textarea - Always Full Width */}
                <form.Field
                  name="content"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Content is required'
                      if (value.length < 10) return 'Content is too short'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <ZevataTextArea
                      field={field}
                      label="Content"
                      placeholder="Enter the word content..."
                      rows={4}
                      required
                    />
                  )}
                />
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
                  disabled={form.state.canSubmit === false || isMutationLoading}
                >
                  {isMutationLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editingWord ? (
                    'Update'
                  ) : (
                    'Add'
                  )}{' '}
                  Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
