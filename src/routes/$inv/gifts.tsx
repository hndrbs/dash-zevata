import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$inv/gifts')({
  component: GiftsPage,
})

function GiftsPage() {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Gifts</h1>
      <p className="text-lg">Hello World - Gifts Page</p>
    </div>
  )
}
