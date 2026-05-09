"use client"

import Image from "next/image"
import { Trash2, BookOpen } from "lucide-react"
import { StarRating } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
  onClick: (book: Book) => void
}

export function BookCard({ book, onDelete, onClick }: BookCardProps) {
  const formattedDate = book.finished_at
    ? new Date(book.finished_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <article className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Cover */}
      <button
        className="relative w-full aspect-[2/3] overflow-hidden bg-muted cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onClick(book)}
        aria-label={`View details for ${book.title}`}
      >
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary/50 p-4">
            <BookOpen className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs text-muted-foreground text-center font-medium leading-snug line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <button
          onClick={() => onClick(book)}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <h2 className="font-serif text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {book.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{book.author}</p>
        </button>

        {book.rating !== null && (
          <StarRating value={book.rating} readonly size="sm" />
        )}

        {book.memo && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
            {book.memo}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-border/50">
          {formattedDate ? (
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          ) : (
            <span />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(book.id)
            }}
            aria-label={`Delete ${book.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  )
}
