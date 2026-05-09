export type Book = {
  id: string
  title: string
  author: string
  cover_url: string | null
  rating: number | null
  memo: string | null
  finished_at: string | null
  created_at: string
}

export type BookInsert = Omit<Book, "id" | "created_at">
