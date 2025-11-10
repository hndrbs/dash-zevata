import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Edit, Plus, Quote, Trash2, X } from 'lucide-react'

export const Route = createFileRoute('/$inv/quotes')({
  component: QuotesPage,
})

type QuoteItem = {
  id: string
  content: string
  author: string
  position: string
}

function QuotesPage() {
  const [quotes, setQuotes] = useState<Array<QuoteItem>>([
    {
      id: '1',
      content:
        'Cinta sejati adalah ketika dua hati saling melengkapi, bukan saling membutuhkan.',
      author: 'John Doe',
      position: 'Groom',
    },
    {
      id: '2',
      content:
        'Kebahagiaan terbesar adalah ketika kita bisa berbagi hidup dengan orang yang tepat.',
      author: 'Jane Smith',
      position: 'Bride',
    },
    {
      id: '3',
      content:
        'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      author: 'Orang Tua',
      position: 'Opening',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<QuoteItem | null>(null)

  const form = useForm({
    defaultValues: {
      content: '',
      author: '',
      position: '',
    },
    onSubmit: ({ value }) => {
      if (editingQuote) {
        // Update existing quote
        setQuotes(
          quotes.map((q) =>
            q.id === editingQuote.id ? { ...value, id: editingQuote.id } : q,
          ),
        )
      } else {
        // Add new quote
        const newQuote: QuoteItem = {
          ...value,
          id: Date.now().toString(),
        }
        setQuotes([...quotes, newQuote])
      }
      handleCloseModal()
    },
  })

  const handleAddQuote = () => {
    setEditingQuote(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditQuote = (quote: QuoteItem) => {
    setEditingQuote(quote)
    form.setFieldValue('content', quote.content)
    form.setFieldValue('author', quote.author)
    form.setFieldValue('position', quote.position)
    setIsModalOpen(true)
  }

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(quotes.filter((q) => q.id !== quoteId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingQuote(null)
    form.reset()
  }

  const positionOptions = [
    'Groom',
    'Bride',
    'Opening',
    'Closing',
    'Parents',
    'Best Man',
    'Maid of Honor',
    'Family',
    'Friends',
    'Custom',
  ]

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <button onClick={handleAddQuote} className="btn btn-primary">
          <Plus size={20} />
          Add Quote
        </button>
      </div>

      {/* Quotes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-start gap-3 mb-4">
                <Quote size={20} className="text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-base italic mb-3">"{quote.content}"</p>
                  <div className="text-sm">
                    <p className="font-medium">{quote.author}</p>
                    <p className="text-base-content/70">{quote.position}</p>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEditQuote(quote)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuote(quote.id)}
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

      {/* Add/Edit Quote Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingQuote ? 'Edit Quote' : 'Add Quote'}
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
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Content Field */}
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
                    <div className="form-control col-span-2">
                      <label className="label block">
                        <span className="label-text">Quote Content *</span>
                      </label>
                      <textarea
                        placeholder="Enter the quote text..."
                        className="textarea textarea-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={4}
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

                {/* Author Field */}
                <form.Field
                  name="author"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Author is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label block">
                        <span className="label-text">Author *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter author name"
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

                {/* Position Field */}
                <form.Field
                  name="position"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Position is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label block">
                        <span className="label-text">Position *</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="">Select position...</option>
                        {positionOptions.map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
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
                  disabled={form.state.canSubmit === false}
                >
                  {editingQuote ? 'Update' : 'Add'} Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
