import { BookShelf } from "@/components/book-shelf"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
              My Book Notes
            </span>
          </div>
        </div>
      </header>

      {/* Shelf */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col">
        <BookShelf />
      </div>

      <Toaster />
    </main>
  )
}
