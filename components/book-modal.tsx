"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { StarRating } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Book, BookInsert } from "@/lib/types"

interface BookModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BookInsert) => Promise<void>
  initialData?: Book | null
  mode: "add" | "view"
}

const empty: BookInsert = {
  title: "",
  author: "",
  cover_url: "",
  rating: null,
  memo: "",
  finished_at: null,
}

export function BookModal({ open, onClose, onSubmit, initialData, mode }: BookModalProps) {
  const [form, setForm] = useState<BookInsert>(empty)
  const [loading, setLoading] = useState(false)
  const isView = mode === "view"

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              title: initialData.title,
              author: initialData.author,
              cover_url: initialData.cover_url ?? "",
              rating: initialData.rating,
              memo: initialData.memo ?? "",
              finished_at: initialData.finished_at,
            }
          : empty
      )
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        cover_url: form.cover_url || null,
        memo: form.memo || null,
        finished_at: form.finished_at || null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formattedDate = initialData?.finished_at
    ? new Date(initialData.finished_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={isView ? initialData?.title : "Add new book"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            {isView ? "Book Details" : "Add a Book"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        {isView && initialData ? (
          <div className="px-6 py-5 flex flex-col gap-4">
            {initialData.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={initialData.cover_url}
                alt={`Cover of ${initialData.title}`}
                className="w-32 h-auto rounded-xl shadow-sm mx-auto object-cover"
              />
            )}
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">{initialData.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{initialData.author}</p>
            </div>
            {initialData.rating !== null && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</span>
                <StarRating value={initialData.rating} readonly size="lg" />
              </div>
            )}
            {formattedDate && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Finished</span>
                <p className="text-sm text-foreground mt-0.5">{formattedDate}</p>
              </div>
            )}
            {initialData.memo && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Memo</span>
                <p className="text-sm text-foreground mt-1 leading-relaxed whitespace-pre-wrap">{initialData.memo}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                required
                placeholder="e.g. The Midnight Library"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                required
                placeholder="e.g. Matt Haig"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cover_url">Cover Image URL</Label>
              <Input
                id="cover_url"
                type="url"
                placeholder="https://..."
                value={form.cover_url ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Rating</Label>
              <StarRating
                value={form.rating ?? 0}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                size="lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="finished_at">Date Finished</Label>
              <Input
                id="finished_at"
                type="date"
                value={form.finished_at ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, finished_at: e.target.value || null }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="memo">Memo</Label>
              <Textarea
                id="memo"
                placeholder="Your thoughts, quotes, or impressions..."
                rows={4}
                value={form.memo ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2 pb-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Book"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
