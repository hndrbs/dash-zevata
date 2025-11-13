import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Edit, GiftIcon, Plus, Trash2, X } from 'lucide-react'
import { ZevataInput } from '../../components/ZevataInput'
import { ZevataSelect } from '../../components/ZevataSelect'
import { ZevataTextArea } from '../../components/ZevataTextArea'
import { del, get, post, put } from '../../lib/api'
import { GiftType } from '../../types/gift'
import type { Gift } from '../../types/gift'

export const Route = createFileRoute('/$inv/gifts')({
  component: GiftsPage,
})

function GiftsPage() {
  const { inv } = Route.useParams()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  // Query for fetching gifts
  const {
    data: gifts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gifts', inv],
    queryFn: () => get<Array<Gift>>({ path: `gift/${inv}` }),
  })

  // Mutation for creating a gift
  const createMutation = useMutation({
    mutationFn: (giftData: Omit<Gift, 'id'>) =>
      post<Gift>(`gift/${inv}`, giftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', inv] })
      handleCloseModal()
    },
  })

  // Mutation for updating a gift
  const updateMutation = useMutation({
    mutationFn: ({
      giftId,
      giftData,
    }: {
      giftId: string
      giftData: Omit<Gift, 'id'>
    }) => put<Gift>(`gift/${inv}/${giftId}`, giftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', inv] })
      handleCloseModal()
    },
  })

  // Mutation for deleting a gift
  const deleteMutation = useMutation({
    mutationFn: (giftId: string) => del(`gift/${inv}/${giftId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', inv] })
    },
  })

  const form = useForm({
    defaultValues: {
      giftType: GiftType.Transfer,
      method: '',
      toPerson: '',
      toTargetId: '',
      thankYouNote: '',
      invId: inv,
      createdAt: new Date(),
    },
    onSubmit: ({ value }) => {
      if (editingGift) {
        updateMutation.mutate({ giftId: editingGift.id, giftData: value })
      } else {
        createMutation.mutate(value)
      }
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
    deleteMutation.mutate(giftId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGift(null)
    form.reset()
  }

  const getGiftTypeBadgeColor = (giftType: GiftType) => {
    switch (giftType) {
      case GiftType.Transfer:
        return 'badge-primary'
      case GiftType.SendPackage:
        return 'badge-secondary'
      default:
        return 'badge-neutral'
    }
  }

  const getGiftTypeIcon = (giftType: GiftType) => {
    switch (giftType) {
      case GiftType.Transfer:
        return '💰'
      case GiftType.SendPackage:
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

  const isMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gifts</h1>
          <button
            onClick={handleAddGift}
            className="btn btn-primary"
            disabled={isMutationLoading}
          >
            <Plus size={20} />
            Add Gift Option
          </button>
        </div>

        {(error ||
          createMutation.error ||
          updateMutation.error ||
          deleteMutation.error) && (
          <div className="alert alert-error mb-6">
            <span>Failed to load gifts. Please try again.</span>
            <button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['gifts', inv] })
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
            <p className="mt-4 text-base-content/70">Loading gifts...</p>
          </div>
        ) : (
          <>
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
                            <span className="font-medium">To:</span>{' '}
                            {gift.toPerson}
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
                            Added:{' '}
                            {new Date(gift.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button
                        onClick={() => handleEditGift(gift)}
                        className="btn btn-ghost btn-sm"
                        disabled={isMutationLoading}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGift(gift.id)}
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

            {gifts.length === 0 && !error && (
              <div className="text-center py-16">
                <GiftIcon size={64} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  No Gift Options Added
                </h3>
                <p className="text-base-content/70 mb-6">
                  Add gift options to let your guests know how they can send
                  their gifts.
                </p>
                <button
                  onClick={handleAddGift}
                  className="btn btn-primary"
                  disabled={isMutationLoading}
                >
                  <Plus size={20} />
                  Add Your First Gift Option
                </button>
              </div>
            )}
          </>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Gift Type Field */}
                    <form.Field
                      name="giftType"
                      children={(field) => (
                        <ZevataSelect
                          field={field}
                          label="Gift Type"
                          options={[
                            { value: '1', label: 'Money Transfer' },
                            { value: '2', label: 'Package Delivery' },
                          ]}
                          required
                        />
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
                        <ZevataSelect
                          field={field}
                          label="Method"
                          options={
                            form.state.values.giftType === GiftType.Transfer
                              ? transferMethods.map((method) => ({
                                  value: method,
                                  label: method,
                                }))
                              : packageMethods.map((method) => ({
                                  value: method,
                                  label: method,
                                }))
                          }
                          placeholder="Select method..."
                          required
                        />
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
                        <ZevataInput
                          field={field}
                          label="Recipient Name"
                          type="text"
                          placeholder="e.g., John & Jane, Bride & Groom"
                          required
                        />
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
                      children={(field) =>
                        form.state.values.giftType === GiftType.Transfer ? (
                          <ZevataInput
                            field={field}
                            label="Account/Number"
                            type="text"
                            placeholder="e.g., 1234567890, 081234567890"
                            required
                          />
                        ) : (
                          <ZevataTextArea
                            field={field}
                            label="Delivery Address"
                            placeholder="Enter complete delivery address"
                            className="md:col-span-2"
                            rows={3}
                            required
                          />
                        )
                      }
                    />
                  </div>

                  {/* Textarea - Always Full Width */}
                  <form.Field
                    name="thankYouNote"
                    children={(field) => (
                      <ZevataTextArea
                        field={field}
                        label="Thank You Note (Optional)"
                        placeholder="Custom thank you message for this gift option"
                        rows={3}
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
                    disabled={
                      form.state.canSubmit === false || isMutationLoading
                    }
                  >
                    {isMutationLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : editingGift ? (
                      'Update'
                    ) : (
                      'Add'
                    )}{' '}
                    Gift Option
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
