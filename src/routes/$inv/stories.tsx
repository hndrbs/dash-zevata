import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$inv/stories')({
  component: StoriesPage,
})

function StoriesPage() {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Stories</h1>
      <p className="text-lg">Hello World - Stories Page</p>
    </div>
  )
}
