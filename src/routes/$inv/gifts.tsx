import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { CreditCard, MapPin, Plus, Smartphone, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/$inv/gifts')({
  component: GiftsPage,
})

type BankAccount = {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
}

type EWallet = {
  id: string
  provider: string
  number: string
  name: string
}

type DeliveryAddress = {
  id: string
  name: string
  address: string
  phone: string
  notes?: string
}

function GiftsPage() {
  const [bankAccounts, setBankAccounts] = useState<Array<BankAccount>>([])
  const [eWallets, setEWallets] = useState<Array<EWallet>>([])
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    Array<DeliveryAddress>
  >([])
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [isEWalletModalOpen, setIsEWalletModalOpen] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const bankForm = useForm({
    defaultValues: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
    },
    onSubmit: ({ value }) => {
      const newAccount: BankAccount = {
        ...value,
        id: Date.now().toString(),
      }
      setBankAccounts([...bankAccounts, newAccount])
      setIsBankModalOpen(false)
      bankForm.reset()
    },
  })

  const eWalletForm = useForm({
    defaultValues: {
      provider: '',
      number: '',
      name: '',
    },
    onSubmit: ({ value }) => {
      const newEWallet: EWallet = {
        ...value,
        id: Date.now().toString(),
      }
      setEWallets([...eWallets, newEWallet])
      setIsEWalletModalOpen(false)
      eWalletForm.reset()
    },
  })

  const addressForm = useForm({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      notes: '',
    },
    onSubmit: ({ value }) => {
      const newAddress: DeliveryAddress = {
        ...value,
        id: Date.now().toString(),
      }
      setDeliveryAddresses([...deliveryAddresses, newAddress])
      setIsAddressModalOpen(false)
      addressForm.reset()
    },
  })

  const deleteBankAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter((account) => account.id !== id))
  }

  const deleteEWallet = (id: string) => {
    setEWallets(eWallets.filter((wallet) => wallet.id !== id))
  }

  const deleteDeliveryAddress = (id: string) => {
    setDeliveryAddresses(
      deliveryAddresses.filter((address) => address.id !== id),
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gift Options</h1>

        {/* Bank Accounts Section */}
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl">
                <CreditCard size={24} />
                Bank Accounts
              </h2>
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add Bank Account
              </button>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                <p>No bank accounts added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{account.bankName}</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Account Number:</span>
                          <br />
                          {account.accountNumber}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Account Holder:</span>
                          <br />
                          {account.accountHolder}
                        </p>
                      </div>
                      <div className="card-actions justify-end">
                        <button
                          onClick={() => deleteBankAccount(account.id)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* E-Wallets Section */}
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl">
                <Smartphone size={24} />
                E-Wallets
              </h2>
              <button
                onClick={() => setIsEWalletModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add E-Wallet
              </button>
            </div>

            {eWallets.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <Smartphone size={48} className="mx-auto mb-4 opacity-50" />
                <p>No e-wallets added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eWallets.map((wallet) => (
                  <div key={wallet.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{wallet.provider}</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Number:</span>
                          <br />
                          {wallet.number}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Name:</span>
                          <br />
                          {wallet.name}
                        </p>
                      </div>
                      <div className="card-actions justify-end">
                        <button
                          onClick={() => deleteEWallet(wallet.id)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Addresses Section */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl">
                <MapPin size={24} />
                Delivery Addresses
              </h2>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>

            {deliveryAddresses.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                <p>No delivery addresses added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryAddresses.map((address) => (
                  <div key={address.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{address.name}</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Address:</span>
                          <br />
                          {address.address}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span>
                          <br />
                          {address.phone}
                        </p>
                        {address.notes && (
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span>
                            <br />
                            {address.notes}
                          </p>
                        )}
                      </div>
                      <div className="card-actions justify-end">
                        <button
                          onClick={() => deleteDeliveryAddress(address.id)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bank Account Modal */}
        {isBankModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Bank Account</h3>
                <button
                  onClick={() => setIsBankModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  bankForm.handleSubmit()
                }}
              >
                <div className="space-y-4">
                  <bankForm.Field
                    name="bankName"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Bank name is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Bank Name *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., BCA, Mandiri, BNI"
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

                  <bankForm.Field
                    name="accountNumber"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Account number is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Account Number *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 1234567890"
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

                  <bankForm.Field
                    name="accountHolder"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Account holder name is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">
                            Account Holder Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., John Doe"
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
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bankForm.state.canSubmit === false}
                  >
                    Add Bank Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* E-Wallet Modal */}
        {isEWalletModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add E-Wallet</h3>
                <button
                  onClick={() => setIsEWalletModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  eWalletForm.handleSubmit()
                }}
              >
                <div className="space-y-4">
                  <eWalletForm.Field
                    name="provider"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Provider is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Provider *</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <option value="">Select Provider</option>
                          <option value="GoPay">GoPay</option>
                          <option value="OVO">OVO</option>
                          <option value="DANA">DANA</option>
                          <option value="LinkAja">LinkAja</option>
                          <option value="ShopeePay">ShopeePay</option>
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

                  <eWalletForm.Field
                    name="number"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Wallet number is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Wallet Number *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 081234567890"
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

                  <eWalletForm.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Name is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Account Name *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., John Doe"
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
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setIsEWalletModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={eWalletForm.state.canSubmit === false}
                  >
                    Add E-Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Address Modal */}
        {isAddressModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Delivery Address</h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addressForm.handleSubmit()
                }}
              >
                <div className="space-y-4">
                  <addressForm.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Address name is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Address Name *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Home Address, Office Address"
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

                  <addressForm.Field
                    name="address"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Address is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Full Address *</span>
                        </label>
                        <textarea
                          placeholder="Enter complete address with street, city, postal code"
                          className="textarea textarea-bordered"
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

                  <addressForm.Field
                    name="phone"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Phone number is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Phone Number *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 081234567890"
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

                  <addressForm.Field
                    name="notes"
                    children={(field) => (
                      <div className="form-control">
                        <label className="label block">
                          <span className="label-text">Notes (Optional)</span>
                        </label>
                        <textarea
                          placeholder="Additional instructions for delivery"
                          className="textarea textarea-bordered"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={2}
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addressForm.state.canSubmit === false}
                  >
                    Add Address
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
