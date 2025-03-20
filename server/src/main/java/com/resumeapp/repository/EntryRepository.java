package com.resumeapp.repository;

import com.resumeapp.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {
    
    List<Entry> findByType(Entry.EntryType type);
    
    List<Entry> findByHighlightTrue();
    
    @Query("SELECT e FROM Entry e JOIN e.keywords k WHERE k IN :keywords GROUP BY e.id ORDER BY COUNT(k) DESC")
    List<Entry> findByKeywords(List<String> keywords);
}