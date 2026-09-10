package com.bookstore.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @Indexed
    private String title;

    @Indexed
    private String author;

    private String isbn;

    @Indexed
    private String category;

    private BigDecimal price;

    private Double rating;

    private Integer reviewsCount;

    private String description;

    private String coverUrl;

    private Boolean featured;

    private Integer stock;

    private Integer publishedYear;

    private String publisher;

    public Book() {}

    public Book(String title, String author, String isbn, String category, BigDecimal price,
                Double rating, Integer reviewsCount, String description, String coverUrl,
                Boolean featured, Integer stock, Integer publishedYear, String publisher) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.price = price;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.description = description;
        this.coverUrl = coverUrl;
        this.featured = featured;
        this.stock = stock;
        this.publishedYear = publishedYear;
        this.publisher = publisher;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
}
