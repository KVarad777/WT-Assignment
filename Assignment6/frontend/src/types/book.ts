export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  price: number;
  rating?: number;
  reviewsCount?: number;
  description: string;
  coverUrl: string;
  featured?: boolean;
  stock?: number;
  publishedYear?: number;
  publisher?: string;
}

export type BookCategory =
  | 'All'
  | 'Technology'
  | 'Design'
  | 'Philosophy'
  | 'Literary Fiction'
  | 'Science'
  | 'History';

export type BookSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'title-asc'
  | 'newest';
