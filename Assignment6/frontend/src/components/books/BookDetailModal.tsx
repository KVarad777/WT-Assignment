import React from 'react';
import { X, Star, BookOpen, Calendar, Building2, Bookmark, Check } from 'lucide-react';
import { Book } from '../../types/book';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [savedToList, setSavedToList] = React.useState(false);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Cover Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Quick Badges */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-[var(--accent)]/20">
                {book.category}
              </span>
              {book.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Staff Pick
                </span>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                {book.title}
              </h2>
              <p className="text-base text-[var(--accent)] font-medium mt-1">
                by {book.author}
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[var(--text-primary)]">
                    {book.rating ? book.rating.toFixed(1) : '4.8'}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-[var(--text-secondary)]">
                  {book.reviewsCount || 1250} verified readers
                </span>
              </div>

              {/* Synopsis */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Editorial Synopsis
                </h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-serif">
                  {book.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                {book.isbn && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>ISBN: <strong className="text-[var(--text-primary)]">{book.isbn}</strong></span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>Published: <strong className="text-[var(--text-primary)]">{book.publishedYear}</strong></span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>Publisher: <strong className="text-[var(--text-primary)]">{book.publisher}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[var(--text-muted)] block">Hardcover Edition</span>
                <span className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                  ${Number(book.price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSavedToList(!savedToList)}
                  className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    savedToList
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  {savedToList ? (
                    <>
                      <Check className="w-4 h-4" />
                      In Reading List
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save to List
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
