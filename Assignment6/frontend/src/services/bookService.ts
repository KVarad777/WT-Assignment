import { request } from './api';
import { Book } from '../types/book';

export const INITIAL_CURATED_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Technology',
    price: 44.99,
    rating: 4.9,
    reviewsCount: 1420,
    description:
      'The definitive guide to the principles and practicalities of distributed data systems, storage engines, and stream processing architectures.',
    coverUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 35,
    publishedYear: 2017,
    publisher: "O'Reilly Media",
  },
  {
    id: 'b2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Technology',
    price: 39.5,
    rating: 4.7,
    reviewsCount: 2890,
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn meaningful naming, formatting, and TDD.",
    coverUrl:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 42,
    publishedYear: 2008,
    publisher: 'Prentice Hall',
  },
  {
    id: 'b3',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '978-0465050659',
    category: 'Design',
    price: 21.95,
    rating: 4.8,
    reviewsCount: 1850,
    description:
      'A tour de force on cognitive ergonomics, user psychology, discoverability, and why human-centered design makes the modern world work.',
    coverUrl:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 50,
    publishedYear: 2013,
    publisher: 'Basic Books',
  },
  {
    id: 'b4',
    title: 'Meditations: A New Translation',
    author: 'Marcus Aurelius',
    isbn: '978-0812968255',
    category: 'Philosophy',
    price: 14.99,
    rating: 4.9,
    reviewsCount: 3400,
    description:
      'Personal reflections and timeless Stoic wisdom written by the Roman Emperor on resilience, civic duty, mortality, and inner tranquility.',
    coverUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 60,
    publishedYear: 2002,
    publisher: 'Modern Library',
  },
  {
    id: 'b5',
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    isbn: '978-1400079278',
    category: 'Literary Fiction',
    price: 18.5,
    rating: 4.6,
    reviewsCount: 2100,
    description:
      'A metaphysical odyssey featuring a runaway boy, talking cats, falling fish, and mysterious labyrinths exploring destiny and subconscious memory.',
    coverUrl:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 28,
    publishedYear: 2005,
    publisher: 'Vintage International',
  },
  {
    id: 'b6',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson & Gerald Jay Sussman',
    isbn: '978-0262510875',
    category: 'Technology',
    price: 65.0,
    rating: 4.9,
    reviewsCount: 890,
    description:
      'The legendary MIT textbook teaching fundamental paradigms of abstraction, recursion, state machines, and metalinguistic programming.',
    coverUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    featured: false,
    stock: 15,
    publishedYear: 1996,
    publisher: 'MIT Press',
  },
  {
    id: 'b7',
    title: 'Cosmos',
    author: 'Carl Sagan',
    isbn: '978-0345331359',
    category: 'Science',
    price: 19.99,
    rating: 4.9,
    reviewsCount: 4200,
    description:
      "A poetic and illuminating voyage through billions of years of cosmic evolution, the birth of stars, and humanity's quest for understanding.",
    coverUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 40,
    publishedYear: 1980,
    publisher: 'Random House',
  },
  {
    id: 'b8',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0374533557',
    category: 'Philosophy',
    price: 17.2,
    rating: 4.7,
    reviewsCount: 5100,
    description:
      'Nobel laureate Kahneman reveals the two cognitive systems that drive human judgment: fast, intuitive thinking vs. slow, deliberate reasoning.',
    coverUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    featured: false,
    stock: 48,
    publishedYear: 2011,
    publisher: 'Farrar, Straus and Giroux',
  },
  {
    id: 'b9',
    title: 'Invisible Cities',
    author: 'Italo Calvino',
    isbn: '978-0156453806',
    category: 'Literary Fiction',
    price: 15.75,
    rating: 4.8,
    reviewsCount: 1300,
    description:
      'Marco Polo describes 55 imaginary cities to Kublai Khan in poetic vignettes exploring memory, desire, architecture, and language.',
    coverUrl:
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    featured: false,
    stock: 22,
    publishedYear: 1974,
    publisher: 'Harcourt Brace',
  },
  {
    id: 'b10',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    category: 'Technology',
    price: 49.99,
    rating: 4.8,
    reviewsCount: 1600,
    description:
      'A masterclass on transforming messy codebases into maintainable, elegant architectures step-by-step with safety and automated testing.',
    coverUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    featured: false,
    stock: 30,
    publishedYear: 2018,
    publisher: 'Addison-Wesley',
  },
  {
    id: 'b11',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    category: 'History',
    price: 22.5,
    rating: 4.7,
    reviewsCount: 6700,
    description:
      'How an insignificant ape became the ruler of planet Earth: from the Cognitive Revolution to agriculture, capitalism, and artificial intelligence.',
    coverUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    featured: true,
    stock: 75,
    publishedYear: 2015,
    publisher: 'Harper',
  },
  {
    id: 'b12',
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    isbn: '978-3721201451',
    category: 'Design',
    price: 55.0,
    rating: 4.9,
    reviewsCount: 950,
    description:
      'The seminal Swiss graphic design manual establishing mathematical proportions, modular grids, and clear typographic hierarchy.',
    coverUrl:
      'https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=600&q=80',
    featured: false,
    stock: 18,
    publishedYear: 1981,
    publisher: 'Niggli Verlag',
  },
];

export const bookService = {
  async getBooks(params?: {
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<Book[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.category && params.category !== 'All') searchParams.append('category', params.category);
      if (params?.sort) searchParams.append('sort', params.sort);

      const queryString = searchParams.toString();
      const endpoint = queryString ? `/books?${queryString}` : '/books';
      return await request<Book[]>(endpoint);
    } catch {
      // Return filtered fallback dataset for offline / static demo
      let list = [...INITIAL_CURATED_BOOKS];
      if (params?.category && params.category !== 'All') {
        list = list.filter((b) => b.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q)
        );
      }
      if (params?.sort) {
        switch (params.sort) {
          case 'price-asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            list.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'title-asc':
            list.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'newest':
            list.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
            break;
          case 'featured':
          default:
            list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
        }
      }
      return list;
    }
  },

  async getFeaturedBooks(): Promise<Book[]> {
    try {
      return await request<Book[]>('/books/featured');
    } catch {
      return INITIAL_CURATED_BOOKS.filter((b) => b.featured);
    }
  },

  async getBookById(id: string): Promise<Book> {
    try {
      return await request<Book>(`/books/${id}`);
    } catch {
      const book = INITIAL_CURATED_BOOKS.find((b) => b.id === id);
      if (book) return book;
      throw new Error('Book not found');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      return await request<string[]>('/books/categories');
    } catch {
      return Array.from(new Set(INITIAL_CURATED_BOOKS.map((b) => b.category))).sort();
    }
  },
};

