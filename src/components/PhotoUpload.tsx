import { useRef, useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface PhotoUploadProps {
  onFileProcessed: (file: File) => void
  onError: (error: string) => void
  maxSize?: number
  acceptedTypes?: Array<string>
}

export default function PhotoUpload({
  onFileProcessed,
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [, setProcessedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert image to WebP and compress
  const processImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    }

    try {
      const compressedFile = await imageCompression(file, options)
      return compressedFile
    } catch (error) {
      console.error('Image compression failed:', error)
      throw new Error('Failed to process image')
    }
  }

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      onError('Invalid file type. Please select an image file.')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      onError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    setIsProcessing(true)

    try {
      // Create preview from original file
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Process image (convert to WebP and compress)
      const processedFile = await processImage(file)
      setProcessedFile(processedFile)

      // Return processed file to parent
      onFileProcessed(processedFile)
    } catch (error) {
      console.error('Image processing failed:', error)
      onError(
        error instanceof Error ? error.message : 'Failed to process image',
      )

      // Clean up preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemovePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setProcessedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {/* File Input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Upload Area */}
      {!previewUrl && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-base-300'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isProcessing ? undefined : handleClickUpload}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload size={48} className="text-base-content/50" />
            <div>
              <p className="text-lg font-medium mb-2">
                {isProcessing ? 'Processing...' : 'Drag & drop your photo here'}
              </p>
              <p className="text-sm text-base-content/70">
                or click to browse files
              </p>
              <p className="text-xs text-base-content/50 mt-2">
                Supports:{' '}
                {acceptedTypes
                  .map((type) => type.replace('image/', ''))
                  .join(', ')}{' '}
                • Max: {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Processing image...</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value="100"
            max="100"
          />
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Photo ready</p>
                  <p className="text-sm text-base-content/70">
                    Click to upload a different photo
                  </p>
                </div>
                <button
                  onClick={handleRemovePreview}
                  className="btn btn-ghost btn-sm text-error"
                  disabled={isProcessing}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden click area to change photo */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={isProcessing ? undefined : handleClickUpload}
          />
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="flex items-center justify-center mt-4">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span>Converting to WebP...</span>
        </div>
      )}
    </div>
  )
}
