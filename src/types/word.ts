export type WordType = 'Opening' | 'Quote' | 'Closing'

export type Word = {
  id: string
  content: string
  author?: string
  title?: string
  type: WordType
}
