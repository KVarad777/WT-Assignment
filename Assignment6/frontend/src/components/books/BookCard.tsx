import React, { useState } from 'react';
import { Star, BookOpen, Eye } from 'lucide-react';
import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onSelectBook: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelectBook }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onSelectBook(book)}
      className="group relative flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--card-shadow-hover)] cursor-pointer hover:-translate-y-1"
    >
      {/* Book Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--bg-surface-subtle)] mb-4 flex items-center justify-center shadow-xs">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-stone-400" />
          </div>
        )}

        {imageError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mb-2" />
            <span className="text-xs font-serif text-[var(--text-secondary)] font-semibold line-clamp-2">
              {book.title}
            </span>
          </div>
        ) : (
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide bg-[var(--bg-surface)]/90 backdrop-blur-md text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs">
            {book.category}
          </span>
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="px-4 py-2 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-semibold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            Read Synopsis
          </span>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex flex-col flex-grow justify-between space-y-3">
        <div>
          <h3 className="font-serif text-base font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium line-clamp-1">
            by {book.author}
          </p>
        </div>

        {/* Rating & Price */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {book.rating ? book.rating.toFixed(1) : '4.8'}
            </span>
            {book.reviewsCount && (
              <span className="text-[11px] text-[var(--text-muted)]">
                ({book.reviewsCount})
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="font-serif text-base font-bold text-[var(--accent)]">
              ${Number(book.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
