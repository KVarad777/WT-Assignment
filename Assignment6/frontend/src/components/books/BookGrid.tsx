import React from 'react';
import { BookCard } from './BookCard';
import { Book } from '../../types/book';
import { BookX, Sparkles } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  onSelectBook: (book: Book) => void;
  onResetFilters?: () => void;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading,
  onSelectBook,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 animate-pulse space-y-4"
          >
            <div className="aspect-[3/4] w-full rounded-xl bg-[var(--bg-surface-subtle)]" />
            <div className="h-4 bg-[var(--bg-surface-subtle)] rounded-md w-3/4" />
            <div className="h-3 bg-[var(--bg-surface-subtle)] rounded-md w-1/2" />
            <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center">
              <div className="h-3 bg-[var(--bg-surface-subtle)] rounded-md w-1/4" />
              <div className="h-4 bg-[var(--bg-surface-subtle)] rounded-md w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface-subtle)]/40 p-12 text-center my-8">
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)] shadow-xs">
          <BookX className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
          No Volumes Found
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto">
          We couldn't find any books matching your current search criteria or category filter.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-6 px-5 py-2 rounded-full text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelectBook={onSelectBook} />
      ))}
    </div>
  );
};
