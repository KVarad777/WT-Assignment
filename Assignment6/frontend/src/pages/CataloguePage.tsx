import React, { useEffect, useState } from 'react';
import { Book, BookSortOption } from '../types/book';
import { bookService } from '../services/bookService';
import { CatalogueFilter } from '../components/books/CatalogueFilter';
import { BookGrid } from '../components/books/BookGrid';
import { BookDetailModal } from '../components/books/BookDetailModal';
import { BookOpen } from 'lucide-react';

interface CataloguePageProps {
  initialCategory?: string;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({ initialCategory = 'All' }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<BookSortOption>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchCatalogueData = async () => {
      setIsLoading(true);
      try {
        const [booksData, categoriesData] = await Promise.all([
          bookService.getBooks({
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            search: searchQuery || undefined,
            sort: selectedSort,
          }),
          bookService.getCategories(),
        ]);
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load catalogue books', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogueData();
  }, [selectedCategory, searchQuery, selectedSort]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedSort('featured');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          <BookOpen className="w-4 h-4" />
          <span>The Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Complete Catalogue
        </h1>
        <p className="text-sm text-[var(--text-secondary)] font-editorial text-lg max-w-2xl">
          Browse through our permanent collection of foundational texts, critical literature, and modern classics.
        </p>
      </div>

      {/* Filter Component */}
      <CatalogueFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        totalResults={books.length}
      />

      {/* Book Grid */}
      <BookGrid
        books={books}
        isLoading={isLoading}
        onSelectBook={setSelectedBook}
        onResetFilters={handleResetFilters}
      />

      {/* Book Detail Modal */}
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};
