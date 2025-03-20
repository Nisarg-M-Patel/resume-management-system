package com.resumeapp.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "resume_entries")
@Data
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Enumerated(EnumType.STRING)
    private EntryType type;
    
    private String organization;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "entry_bullets", joinColumns = @JoinColumn(name = "entry_id"))
    @Column(name = "bullet", columnDefinition = "TEXT")
    private List<String> bullets = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "entry_keywords", joinColumns = @JoinColumn(name = "entry_id"))
    @Column(name = "keyword")
    private Set<String> keywords = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "entry_urls", joinColumns = @JoinColumn(name = "entry_id"))
    private List<Url> urls = new ArrayList<>();
    
    private boolean highlight;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum EntryType {
        EXPERIENCE, PROJECT, EDUCATION, SKILL
    }
    
    @Embeddable
    @Data
    public static class Url {
        private String title;
        private String url;
    }
}