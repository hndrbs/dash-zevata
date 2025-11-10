type LoadingSkeletonProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  count?: number
  className?: string
}

const sizeClasses = {
  sm: 'h-16',
  md: 'h-24',
  lg: 'h-32',
  xl: 'h-40',
}

export default function LoadingSkeleton({
  size = 'md',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`bg-primary/10 rounded-lg animate-pulse ${sizeClasses[size]} ${className}`}
    />
  ))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{skeletons}</div>
  )
}
