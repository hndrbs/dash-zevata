import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Edit, Loader2, Plus, Trash2, X } from 'lucide-react'
import PhotoUpload from '../../components/PhotoUpload'

export const Route = createFileRoute('/$inv/profile')({
  component: ProfilePage,
})

type Profile = {
  id: string
  name: string
  nickname: string
  parentsName?: string
  address?: string
  otherInfo?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  twitter?: string
  photoUrl?: string
}

function ProfilePage() {
  const [profiles, setProfiles] = useState<Array<Profile>>([
    {
      id: '1',
      name: 'John Doe',
      nickname: 'Johnny',
      parentsName: 'Michael & Sarah Doe',
      address: '123 Main Street, City',
      otherInfo: 'Loves hiking and photography',
      facebook: 'john.doe',
      instagram: '@johndoe',
      tiktok: '@johndoe',
      twitter: '@johndoe',
      photoUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Jane Smith',
      nickname: 'Janey',
      parentsName: 'Robert & Lisa Smith',
      address: '456 Oak Avenue, Town',
      otherInfo: 'Enjoys cooking and traveling',
      facebook: 'jane.smith',
      instagram: '@janesmith',
      tiktok: '@janesmith',
      twitter: '@janesmith',
      photoUrl:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      nickname: '',
      parentsName: '',
      address: '',
      otherInfo: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      twitter: '',
      photoUrl: '',
      photoFile: null as File | null,
    },
    onSubmit: async ({ value }) => {
      // If there's a photo file to upload, handle it first
      let photoUrl = value.photoUrl

      if (value.photoFile) {
        try {
          setIsUploading(true)
          setUploadError(null)
          photoUrl = await uploadToCloudflareR2(value.photoFile)
        } catch (error) {
          setUploadError(
            error instanceof Error ? error.message : 'Upload failed',
          )
          setIsUploading(false)
          return
        }
      }

      if (editingProfile) {
        // Update existing profile
        setProfiles(
          profiles.map((p) =>
            p.id === editingProfile.id
              ? { ...value, photoUrl, id: editingProfile.id }
              : p,
          ),
        )
      } else {
        // Add new profile
        const newProfile: Profile = {
          ...value,
          photoUrl,
          id: Date.now().toString(),
        }
        setProfiles([...profiles, newProfile])
      }
      setIsUploading(false)
      handleCloseModal()
    },
  })

  const handleAddProfile = () => {
    setEditingProfile(null)
    form.reset()
    setIsModalOpen(true)
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    form.setFieldValue('name', profile.name)
    form.setFieldValue('nickname', profile.nickname)
    form.setFieldValue('parentsName', profile.parentsName || '')
    form.setFieldValue('address', profile.address || '')
    form.setFieldValue('otherInfo', profile.otherInfo || '')
    form.setFieldValue('facebook', profile.facebook || '')
    form.setFieldValue('instagram', profile.instagram || '')
    form.setFieldValue('tiktok', profile.tiktok || '')
    form.setFieldValue('twitter', profile.twitter || '')
    form.setFieldValue('photoUrl', profile.photoUrl || '')
    form.setFieldValue('photoFile', null)
    setIsModalOpen(true)
  }

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(profiles.filter((p: Profile) => p.id !== profileId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProfile(null)
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
    const fileName = `profiles/${timestamp}-${Math.random().toString(36).substring(2)}.webp`

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
    form.setFieldValue('photoFile', file)
    form.setFieldValue('photoUrl', '') // Clear existing URL if any
  }

  const handlePhotoError = (error: string) => {
    setUploadError(error)
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <button onClick={handleAddProfile} className="btn btn-primary">
          <Plus size={20} />
          Add Profile
        </button>
      </div>

      {/* Profiles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                {profile.photoUrl && (
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
                      <img src={profile.photoUrl} alt={profile.name} />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="card-title text-lg">{profile.name}</h3>
                  <p className="text-sm text-base-content/70">
                    {profile.nickname}
                  </p>
                </div>
              </div>

              {profile.parentsName && (
                <p className="text-sm mb-2">
                  <strong>Parents:</strong> {profile.parentsName}
                </p>
              )}
              {profile.address && (
                <p className="text-sm mb-2">
                  <strong>Address:</strong> {profile.address}
                </p>
              )}
              {profile.otherInfo && (
                <p className="text-sm mb-4">{profile.otherInfo}</p>
              )}

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEditProfile(profile)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
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

      {/* Add/Edit Profile Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingProfile ? 'Edit Profile' : 'Add Profile'}
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
                {/* Name Field */}
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Name is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
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

                {/* Nickname Field */}
                <form.Field
                  name="nickname"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Nickname is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nickname *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter nickname"
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

                {/* Parents Name Field */}
                <form.Field
                  name="parentsName"
                  children={(field) => (
                    <div className="form-control col-span-2">
                      <label className="label">
                        <span className="label-text">Parents Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter parents' names"
                        className="input input-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                {/* Address Field */}
                <form.Field
                  name="address"
                  children={(field) => (
                    <div className="col-span-2 w-full">
                      <label className="label block">
                        <span className="label-text">Address</span>
                      </label>
                      <textarea
                        placeholder="Enter address"
                        className="textarea textarea-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                {/* Other Info Field */}
                <form.Field
                  name="otherInfo"
                  children={(field) => (
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text">Other Info</span>
                      </label>
                      <input
                        placeholder="Enter additional information"
                        className="input input-bordered w-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                {/* Social Media Fields */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold mb-3">
                    Social Media (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="facebook"
                      children={(field) => (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Facebook</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Facebook username"
                            className="input input-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <form.Field
                      name="instagram"
                      children={(field) => (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Instagram</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Instagram username"
                            className="input input-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <form.Field
                      name="tiktok"
                      children={(field) => (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">TikTok</span>
                          </label>
                          <input
                            type="text"
                            placeholder="TikTok username"
                            className="input input-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <form.Field
                      name="twitter"
                      children={(field) => (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">X (Twitter)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Twitter username"
                            className="input input-bordered"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Photo Upload Field */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Profile Photo</span>
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
                  {form.state.values.photoUrl &&
                    !form.state.values.photoFile && (
                      <div className="mt-2">
                        <p className="text-sm text-success">
                          Current photo URL: {form.state.values.photoUrl}
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
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : editingProfile ? (
                    'Update'
                  ) : (
                    'Add'
                  )}{' '}
                  Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
