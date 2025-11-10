import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$inv/quotes')({
  component: QuotesPage,
})

function QuotesPage() {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Quotes</h1>
      <p className="text-lg">Hello World - Quotes Page</p>
    </div>
  )
}
