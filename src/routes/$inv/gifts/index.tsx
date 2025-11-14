import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Edit, GiftIcon, Plus, Trash2, X } from 'lucide-react'
import { ZevataInput } from '../../../components/ZevataInput'
import { ZevataSelect } from '../../../components/ZevataSelect'
import { ZevataTextArea } from '../../../components/ZevataTextArea'
import { del, get, post, put } from '../../../lib/api'
import { GiftType } from '../../../types/gift'
import type { Gift } from '../../../types/gift'

export const Route = createFileRoute('/$inv/gifts/')({
  component: TransferGiftsPage,
})

function TransferGiftsPage() {
  const { inv } = Route.useParams()
  console.log({ inv })
  const queryClient = useQueryClient()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
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
      handleCloseTransferModal()
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
      handleCloseTransferModal()
    },
  })

  // Mutation for deleting a gift
  const deleteMutation = useMutation({
    mutationFn: (giftId: string) => del(`gift/${inv}/${giftId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', inv] })
    },
  })

  const handleAddTransferGift = () => {
    setEditingGift(null)
    transferForm.reset()
    setIsTransferModalOpen(true)
  }

  const handleEditGift = (gift: Gift) => {
    setEditingGift(gift)
    transferForm.setFieldValue('method', gift.method)
    transferForm.setFieldValue('toPerson', gift.toPerson)
    transferForm.setFieldValue('toTargetId', gift.toTargetId)
    transferForm.setFieldValue('thankYouNote', gift.thankYouNote)
    setIsTransferModalOpen(true)
  }

  const handleDeleteGift = (giftId: string) => {
    deleteMutation.mutate(giftId)
  }

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false)
    setEditingGift(null)
    transferForm.reset()
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

  // Transfer Form
  const transferForm = useForm({
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

  const isMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Money Transfer Gifts</h1>
            <p className="text-base-content/70 mt-2">
              Manage money transfer options for your guests
            </p>
          </div>
          <button
            onClick={handleAddTransferGift}
            className="btn btn-primary"
            disabled={isMutationLoading}
          >
            <Plus size={20} />
            Add Money Transfer
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
              {gifts
                .filter((gift) => gift.giftType === GiftType.Transfer)
                .map((gift) => (
                  <div key={gift.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="text-2xl">
                          {getGiftTypeIcon(gift.giftType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="card-title text-lg">
                              {gift.method}
                            </h3>
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

            {gifts.filter((gift) => gift.giftType === GiftType.Transfer)
              .length === 0 &&
              !error && (
                <div className="text-center py-16">
                  <GiftIcon size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Money Transfer Options Added
                  </h3>
                  <p className="text-base-content/70 mb-6">
                    Add money transfer options to let your guests know how they
                    can send their gifts.
                  </p>
                  <button
                    onClick={handleAddTransferGift}
                    className="btn btn-primary"
                    disabled={isMutationLoading}
                  >
                    <Plus size={20} />
                    Add Your First Money Transfer Option
                  </button>
                </div>
              )}
          </>
        )}

        {/* Money Transfer Modal */}
        {isTransferModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingGift ? 'Edit Money Transfer' : 'Add Money Transfer'}
                </h3>
                <button
                  onClick={handleCloseTransferModal}
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
                  transferForm.handleSubmit()
                }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Method Field */}
                    <transferForm.Field
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
                          label="Transfer Method *"
                          options={transferMethods.map((method) => ({
                            value: method,
                            label: method,
                          }))}
                          placeholder="Select transfer method..."
                          required
                        />
                      )}
                    />

                    {/* To Person Field */}
                    <transferForm.Field
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
                          label="Recipient Name *"
                          type="text"
                          placeholder="e.g., John & Jane, Bride & Groom"
                          required
                        />
                      )}
                    />

                    {/* To Target ID Field */}
                    <transferForm.Field
                      name="toTargetId"
                      validators={{
                        onChange: ({ value }) => {
                          if (!value) return 'Account/Number is required'
                          return undefined
                        },
                      }}
                      children={(field) => (
                        <ZevataInput
                          field={field}
                          label="Account/Number *"
                          type="text"
                          placeholder="e.g., 1234567890, 081234567890"
                          className="md:col-span-2"
                          required
                        />
                      )}
                    />
                  </div>

                  {/* Textarea - Always Full Width */}
                  <transferForm.Field
                    name="thankYouNote"
                    children={(field) => (
                      <ZevataTextArea
                        field={field}
                        label="Thank You Note (Optional)"
                        placeholder="Custom thank you message for this transfer option"
                        rows={3}
                      />
                    )}
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={handleCloseTransferModal}
                    className="btn btn-ghost"
                    disabled={isMutationLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      transferForm.state.canSubmit === false ||
                      isMutationLoading
                    }
                  >
                    {isMutationLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : editingGift ? (
                      'Update'
                    ) : (
                      'Add'
                    )}{' '}
                    Transfer Option
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
