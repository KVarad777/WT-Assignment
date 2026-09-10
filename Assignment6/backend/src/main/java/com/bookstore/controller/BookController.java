package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.model.Book;
import com.bookstore.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Book>>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {
        List<Book> books = bookService.getAllBooks(search, category, sort);
        return ResponseEntity.ok(ApiResponse.success("Books retrieved successfully", books));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Book>>> getFeaturedBooks() {
        List<Book> featuredBooks = bookService.getFeaturedBooks();
        return ResponseEntity.ok(ApiResponse.success("Featured books retrieved successfully", featuredBooks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBookById(@PathVariable String id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success("Book details retrieved successfully", book));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = bookService.getCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
