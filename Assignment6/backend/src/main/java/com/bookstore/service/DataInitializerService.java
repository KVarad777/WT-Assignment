package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializerService.class);
    private final BookRepository bookRepository;

    public DataInitializerService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            log.info("Seeding initial curated bookstore catalogue into MongoDB...");
            List<Book> initialBooks = getInitialBooks();
            bookRepository.saveAll(initialBooks);
            log.info("Successfully seeded {} books into MongoDB.", initialBooks.size());
        } else {
            log.info("MongoDB already contains {} books. Skipping seeding.", bookRepository.count());
        }
    }

    private List<Book> getInitialBooks() {
        return Arrays.asList(
                new Book(
                        "Designing Data-Intensive Applications",
                        "Martin Kleppmann",
                        "978-1449373320",
                        "Technology",
                        new BigDecimal("44.99"),
                        4.9,
                        1420,
                        "The definitive guide to the principles and practicalities of distributed data systems, storage engines, and stream processing architectures.",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                        true,
                        35,
                        2017,
                        "O'Reilly Media"
                ),
                new Book(
                        "Clean Code: A Handbook of Agile Software Craftsmanship",
                        "Robert C. Martin",
                        "978-0132350884",
                        "Technology",
                        new BigDecimal("39.50"),
                        4.7,
                        2890,
                        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn meaningful naming, formatting, and TDD.",
                        "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
                        true,
                        42,
                        2008,
                        "Prentice Hall"
                ),
                new Book(
                        "The Design of Everyday Things",
                        "Don Norman",
                        "978-0465050659",
                        "Design",
                        new BigDecimal("21.95"),
                        4.8,
                        1850,
                        "A tour de force on cognitive ergonomics, user psychology, discoverability, and why human-centered design makes the modern world work.",
                        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
                        true,
                        50,
                        2013,
                        "Basic Books"
                ),
                new Book(
                        "Meditations: A New Translation",
                        "Marcus Aurelius",
                        "978-0812968255",
                        "Philosophy",
                        new BigDecimal("14.99"),
                        4.9,
                        3400,
                        "Personal reflections and timeless Stoic wisdom written by the Roman Emperor on resilience, civic duty, mortality, and inner tranquility.",
                        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                        true,
                        60,
                        2002,
                        "Modern Library"
                ),
                new Book(
                        "Kafka on the Shore",
                        "Haruki Murakami",
                        "978-1400079278",
                        "Literary Fiction",
                        new BigDecimal("18.50"),
                        4.6,
                        2100,
                        "A metaphysical odyssey featuring a runaway boy, talking cats, falling fish, and mysterious labyrinths exploring destiny and subconscious memory.",
                        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
                        true,
                        28,
                        2005,
                        "Vintage International"
                ),
                new Book(
                        "Structure and Interpretation of Computer Programs",
                        "Harold Abelson & Gerald Jay Sussman",
                        "978-0262510875",
                        "Technology",
                        new BigDecimal("65.00"),
                        4.9,
                        890,
                        "The legendary MIT textbook teaching fundamental paradigms of abstraction, recursion, state machines, and metalinguistic programming.",
                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
                        false,
                        15,
                        1996,
                        "MIT Press"
                ),
                new Book(
                        "Cosmos",
                        "Carl Sagan",
                        "978-0345331359",
                        "Science",
                        new BigDecimal("19.99"),
                        4.9,
                        4200,
                        "A poetic and illuminating voyage through billions of years of cosmic evolution, the birth of stars, and humanity's quest for understanding.",
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                        true,
                        40,
                        1980,
                        "Random House"
                ),
                new Book(
                        "Thinking, Fast and Slow",
                        "Daniel Kahneman",
                        "978-0374533557",
                        "Philosophy",
                        new BigDecimal("17.20"),
                        4.7,
                        5100,
                        "Nobel laureate Kahneman reveals the two cognitive systems that drive human judgment: fast, intuitive thinking vs. slow, deliberate reasoning.",
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                        false,
                        48,
                        2011,
                        "Farrar, Straus and Giroux"
                ),
                new Book(
                        "Invisible Cities",
                        "Italo Calvino",
                        "978-0156453806",
                        "Literary Fiction",
                        new BigDecimal("15.75"),
                        4.8,
                        1300,
                        "Marco Polo describes 55 imaginary cities to Kublai Khan in poetic vignettes exploring memory, desire, architecture, and language.",
                        "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
                        false,
                        22,
                        1974,
                        "Harcourt Brace"
                ),
                new Book(
                        "Refactoring: Improving the Design of Existing Code",
                        "Martin Fowler",
                        "978-0134757599",
                        "Technology",
                        new BigDecimal("49.99"),
                        4.8,
                        1600,
                        "A masterclass on transforming messy codebases into maintainable, elegant architectures step-by-step with safety and automated testing.",
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
                        false,
                        30,
                        2018,
                        "Addison-Wesley"
                ),
                new Book(
                        "Sapiens: A Brief History of Humankind",
                        "Yuval Noah Harari",
                        "978-0062316097",
                        "History",
                        new BigDecimal("22.50"),
                        4.7,
                        6700,
                        "How an insignificant ape became the ruler of planet Earth: from the Cognitive Revolution to agriculture, capitalism, and artificial intelligence.",
                        "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
                        true,
                        75,
                        2015,
                        "Harper"
                ),
                new Book(
                        "Grid Systems in Graphic Design",
                        "Josef Müller-Brockmann",
                        "978-3721201451",
                        "Design",
                        new BigDecimal("55.00"),
                        4.9,
                        950,
                        "The seminal Swiss graphic design manual establishing mathematical proportions, modular grids, and clear typographic hierarchy.",
                        "https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=600&q=80",
                        false,
                        18,
                        1981,
                        "Niggli Verlag"
                )
        );
    }
}
