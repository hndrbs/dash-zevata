import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Gift, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/gifts')({
  component: GiftsPage,
})

type GiftType = 'Transfer' | 'SendPackage'

type Gift = {
  id: string
  invitationId: string
  giftType: GiftType
  method: string
  toPerson: string
  toTargetId: string
  thankYouNote: string
  createdAt: Date
}

function GiftsPage() {
  const [gifts, setGifts] = useState<Array<Gift>>([
    {
      id: '1',
      invitationId: 'inv-123',
      giftType: 'Transfer',
      method: 'Bank Transfer - BCA',
      toPerson: 'John & Jane',
      toTargetId: '1234567890',
      thankYouNote: 'Thank you for your generous gift!',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      invitationId: 'inv-123',
      giftType: 'SendPackage',
      method: 'Home Delivery',
      toPerson: 'Bride & Groom',
      toTargetId: 'Jl. Example No. 123, Jakarta',
      thankYouNote: 'We appreciate your thoughtful present!',
      createdAt: new Date('2024-01-16'),
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  const form = useForm({
    defaultValues: {
      giftType: 'Transfer' as GiftType,
      method: '',
      toPerson: '',
      toTargetId: '',
      thankYouNote: '',
    },
    onSubmit: ({ value }) => {
      if (editingGift) {
        // Update existing gift
        setGifts(
          gifts.map((g) =>
            g.id === editingGift.id
              ? {
                  ...value,
                  id: editingGift.id,
                  invitationId: editingGift.invitationId,
                  createdAt: editingGift.createdAt,
                }
              : g,
          ),
        )
      } else {
        // Add new gift
        const newGift: Gift = {
          ...value,
          id: Date.now().toString(),
          invitationId: 'inv-123', // This should come from route params
          createdAt: new Date(),
        }
        setGifts([...gifts, newGift])
      }
      handleCloseModal()
    },
  })

  const handleAddGift = () => {
    setEditingGift(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditGift = (gift: Gift) => {
    setEditingGift(gift)
    form.setFieldValue('giftType', gift.giftType)
    form.setFieldValue('method', gift.method)
    form.setFieldValue('toPerson', gift.toPerson)
    form.setFieldValue('toTargetId', gift.toTargetId)
    form.setFieldValue('thankYouNote', gift.thankYouNote)
    setIsModalOpen(true)
  }

  const handleDeleteGift = (giftId: string) => {
    setGifts(gifts.filter((g) => g.id !== giftId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGift(null)
    form.reset()
  }

  const getGiftTypeBadgeColor = (type: GiftType) => {
    switch (type) {
      case 'Transfer':
        return 'badge-primary'
      case 'SendPackage':
        return 'badge-secondary'
      default:
        return 'badge-neutral'
    }
  }

  const getGiftTypeIcon = (type: GiftType) => {
    switch (type) {
      case 'Transfer':
        return '💰'
      case 'SendPackage':
        return '📦'
      default:
        return '🎁'
    }
  }

  const transferMethods = [
    'Bank Transfer - BCA',
    'Bank Transfer - Mandiri',
    'Bank Transfer - BNI',
    'Bank Transfer - BRI',
    'GoPay',
    'OVO',
    'DANA',
    'LinkAja',
    'ShopeePay',
  ]

  const packageMethods = [
    'Home Delivery',
    'Office Delivery',
    'Pickup Point',
    'Courier Service',
  ]

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gifts</h1>
          <button onClick={handleAddGift} className="btn btn-primary">
            <Plus size={20} />
            Add Gift Option
          </button>
        </div>

        {/* Gifts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-2xl">
                    {getGiftTypeIcon(gift.giftType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="card-title text-lg">{gift.method}</h3>
                      <span
                        className={`badge badge-sm ${getGiftTypeBadgeColor(gift.giftType)}`}
                      >
                        {gift.giftType}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">To:</span> {gift.toPerson}
                      </p>
                      <p>
                        <span className="font-medium">Target:</span>{' '}
                        {gift.toTargetId}
                      </p>
                      {gift.thankYouNote && (
                        <p className="italic text-base-content/70">
                          "{gift.thankYouNote}"
                        </p>
                      )}
                      <p className="text-xs text-base-content/50">
                        Added: {gift.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleEditGift(gift)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGift(gift.id)}
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

        {gifts.length === 0 && (
          <div className="text-center py-16">
            <Gift size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              No Gift Options Added
            </h3>
            <p className="text-base-content/70 mb-6">
              Add gift options to let your guests know how they can send their
              gifts.
            </p>
            <button onClick={handleAddGift} className="btn btn-primary">
              <Plus size={20} />
              Add Your First Gift Option
            </button>
          </div>
        )}

        {/* Add/Edit Gift Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingGift ? 'Edit Gift Option' : 'Add Gift Option'}
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
                <div className="space-y-4">
                  {/* Gift Type Field */}
                  <form.Field
                    name="giftType"
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Gift Type *</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value as GiftType)
                          }
                        >
                          <option value="Transfer">Money Transfer</option>
                          <option value="SendPackage">Package Delivery</option>
                        </select>
                      </div>
                    )}
                  />

                  {/* Method Field */}
                  <form.Field
                    name="method"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Method is required'
                        return undefined
                      },
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Method *</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <option value="">Select method...</option>
                          {form.state.values.giftType === 'Transfer'
                            ? transferMethods.map((method) => (
                                <option key={method} value={method}>
                                  {method}
                                </option>
                              ))
                            : packageMethods.map((method) => (
                                <option key={method} value={method}>
                                  {method}
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

                  {/* To Person Field */}
                  <form.Field
                    name="toPerson"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Recipient name is required'
                        return undefined
                      },
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Recipient Name *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., John & Jane, Bride & Groom"
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

                  {/* To Target ID Field */}
                  <form.Field
                    name="toTargetId"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Target information is required'
                        return undefined
                      },
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">
                            {form.state.values.giftType === 'Transfer'
                              ? 'Account/Number *'
                              : 'Delivery Address *'}
                          </span>
                        </label>
                        {form.state.values.giftType === 'Transfer' ? (
                          <input
                            type="text"
                            placeholder="e.g., 1234567890, 081234567890"
                            className="input input-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        ) : (
                          <textarea
                            placeholder="Enter complete delivery address"
                            className="textarea textarea-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            rows={3}
                          />
                        )}
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

                  {/* Thank You Note Field */}
                  <form.Field
                    name="thankYouNote"
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">
                            Thank You Note (Optional)
                          </span>
                        </label>
                        <textarea
                          placeholder="Custom thank you message for this gift option"
                          className="textarea textarea-bordered"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={3}
                        />
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
                    {editingGift ? 'Update' : 'Add'} Gift Option
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
