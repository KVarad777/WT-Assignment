package com.bookstore.service;

import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks(String search, String category, String sortBy) {
        List<Book> books;

        boolean hasSearch = StringUtils.hasText(search);
        boolean hasCategory = StringUtils.hasText(category) && !"all".equalsIgnoreCase(category);

        if (hasSearch && hasCategory) {
            books = bookRepository.searchByCategoryAndKeyword(search.trim(), category.trim());
        } else if (hasSearch) {
            books = bookRepository.searchBooks(search.trim());
        } else if (hasCategory) {
            books = bookRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            books = bookRepository.findAll();
        }

        // Apply sorting
        if (StringUtils.hasText(sortBy)) {
            switch (sortBy.toLowerCase()) {
                case "price-asc":
                    books.sort(Comparator.comparing(Book::getPrice));
                    break;
                case "price-desc":
                    books.sort(Comparator.comparing(Book::getPrice).reversed());
                    break;
                case "rating":
                    books.sort(Comparator.comparing(Book::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "title-asc":
                    books.sort(Comparator.comparing(Book::getTitle, String.CASE_INSENSITIVE_ORDER));
                    break;
                case "newest":
                    books.sort(Comparator.comparing(Book::getPublishedYear, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "featured":
                default:
                    books.sort((b1, b2) -> Boolean.compare(
                            Boolean.TRUE.equals(b2.getFeatured()),
                            Boolean.TRUE.equals(b1.getFeatured())
                    ));
                    break;
            }
        }

        return books;
    }

    public List<Book> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    public Book getBookById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public List<String> getCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .filter(StringUtils::hasText)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
