"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Plus, BookOpen } from "lucide-react"
import { BookCard } from "@/components/book-card"
import { BookModal } from "@/components/book-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Book, BookInsert } from "@/lib/types"

const BOOKS_KEY = "/api/books"

async function fetcher(url: string): Promise<Book[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch books")
  return res.json()
}

export function BookShelf() {
  const { data: books, isLoading } = useSWR<Book[]>(BOOKS_KEY, fetcher)
  const [addOpen, setAddOpen] = useState(false)
  const [selected, setSelected] = useState<Book | null>(null)
  const { toast } = useToast()

  const handleAdd = async (data: BookInsert) => {
    const res = await fetch(BOOKS_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      toast({ title: "Failed to add book", variant: "destructive" })
      return
    }
    await mutate(BOOKS_KEY)
    toast({ title: "Book added to your shelf" })
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`${BOOKS_KEY}/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast({ title: "Failed to delete book", variant: "destructive" })
      return
    }
    await mutate(BOOKS_KEY)
    toast({ title: "Book removed from your shelf" })
  }

  const isEmpty = !isLoading && (!books || books.length === 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="aspect-[2/3] rounded-2xl bg-muted" />
              <div className="h-3 bg-muted rounded-full w-3/4" />
              <div className="h-3 bg-muted rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col flex-1 items-center justify-center gap-4 py-24 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Your shelf is empty</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Start logging the books you&apos;ve read and your thoughts on them.
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="mt-2 gap-2">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add your first book
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
          {books!.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={handleDelete}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {!isEmpty && (
        <Button
          onClick={() => setAddOpen(true)}
          size="icon"
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Add a new book"
        >
          <Plus className="w-6 h-6" aria-hidden="true" />
        </Button>
      )}

      {/* Modals */}
      <BookModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        mode="add"
      />
      <BookModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onSubmit={async () => {}}
        initialData={selected}
        mode="view"
      />
    </div>
  )
}
