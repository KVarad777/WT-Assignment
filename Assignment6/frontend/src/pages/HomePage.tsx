import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Feather, Award } from 'lucide-react';
import { Book } from '../types/book';
import { bookService } from '../services/bookService';
import { BookCard } from '../components/books/BookCard';
import { BookDetailModal } from '../components/books/BookDetailModal';

interface HomePageProps {
  onNavigate: (page: 'home' | 'catalogue' | 'login' | 'register') => void;
  onSelectCategoryFilter: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectCategoryFilter }) => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const books = await bookService.getFeaturedBooks();
        setFeaturedBooks(books.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured books', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategoryClick = (category: string) => {
    onSelectCategoryFilter(category);
    onNavigate('catalogue');
  };

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface)] to-[var(--bg-surface-subtle)] p-8 sm:p-14 overflow-hidden shadow-[var(--card-shadow)]">
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--accent-text)]">
            <Feather className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Independent Literary Press & Bookshop</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
            Curated volumes for the <span className="italic font-normal text-[var(--accent)]">curious mind</span>.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-editorial text-xl sm:text-2xl">
            A sanctuary of essential software engineering craft, timeless stoic philosophy, human design, and transcendent literary fiction.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('catalogue')}
              className="px-6 py-3.5 rounded-full text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 group active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>Explore The Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleCategoryClick('Technology')}
              className="px-5 py-3.5 rounded-full text-sm font-medium border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
            >
              Software & Craft
            </button>
          </div>
        </div>
      </section>

      {/* Featured Books Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <Award className="w-4 h-4" />
              <span>Curator's Selection</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
              Featured Volumes
            </h2>
          </div>

          <button
            onClick={() => onNavigate('catalogue')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelectBook={setSelectedBook} />
            ))}
          </div>
        )}
      </section>

      {/* Curated Categories Shelf */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Browse By Focus
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
            Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              name: 'Technology',
              tagline: 'Distributed systems, clean code, and computing fundamentals.',
              count: '3 Volumes',
            },
            {
              name: 'Philosophy',
              tagline: 'Stoic reflections, human cognition, and enduring wisdom.',
              count: '2 Volumes',
            },
            {
              name: 'Literary Fiction',
              tagline: 'Magical realism, poetic landscapes, and metaphysical odysseys.',
              count: '2 Volumes',
            },
            {
              name: 'Design',
              tagline: 'Human-centered interfaces, typography, and Swiss grid systems.',
              count: '2 Volumes',
            },
            {
              name: 'Science',
              tagline: 'Cosmic evolution, physics, and empirical voyages of discovery.',
              count: '1 Volume',
            },
            {
              name: 'History',
              tagline: 'Civilizational revolutions and the human narrative across millennia.',
              count: '1 Volume',
            },
          ].map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] px-2 py-0.5 rounded-md bg-[var(--bg-surface-subtle)]">
                    {category.count}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {category.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center text-xs font-semibold text-[var(--accent)] gap-1">
                <span>Browse Shelf</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Quote & Trust Section */}
      <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
        <Feather className="w-6 h-6 text-[var(--accent)] mx-auto" />
        <blockquote className="font-editorial text-2xl sm:text-3xl italic text-[var(--text-primary)] max-w-2xl mx-auto leading-snug">
          “A room without books is like a body without a soul.”
        </blockquote>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          — Marcus Tullius Cicero
        </p>
      </section>

      {/* Book Detail Modal */}
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};
