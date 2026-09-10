package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByFeaturedTrue();

    List<Book> findByCategoryIgnoreCase(String category);

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'author': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Book> searchBooks(String keyword);

    @Query("{ 'category': { $regex: ?1, $options: 'i' }, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'author': { $regex: ?0, $options: 'i' } } ] }")
    List<Book> searchByCategoryAndKeyword(String keyword, String category);

    @Query(value = "{}", fields = "{ 'category' : 1 }")
    List<Book> findAllCategories();
}
