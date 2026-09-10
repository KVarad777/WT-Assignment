import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { BookSortOption } from '../../types/book';

interface CatalogueFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSort: BookSortOption;
  onSortChange: (sort: BookSortOption) => void;
  totalResults: number;
}

export const CatalogueFilter: React.FC<CatalogueFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  totalResults,
}) => {
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  return (
    <div className="space-y-6 pb-8 border-b border-[var(--border-subtle)]">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full text-sm bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">
              Sort:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as BookSortOption)}
              className="px-3.5 py-2 rounded-full text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured / Curated</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="newest">Publication Year</option>
            </select>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {totalResults} {totalResults === 1 ? 'Volume' : 'Volumes'}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allCategories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent)] text-white shadow-sm font-semibold scale-102'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
