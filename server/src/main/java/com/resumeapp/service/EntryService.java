package com.resumeapp.service;

import com.resumeapp.model.Entry;
import com.resumeapp.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EntryService {

    private final EntryRepository repository;
    
    @Autowired
    public EntryService(EntryRepository repository) {
        this.repository = repository;
    }
    
    public List<Entry> getAllEntries() {
        return repository.findAll();
    }
    
    public Entry getEntryById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Entry not found with id: " + id));
    }
    
    public List<Entry> getEntriesByType(Entry.EntryType type) {
        return repository.findByType(type);
    }
    
    public List<Entry> getHighlightedEntries() {
        return repository.findByHighlightTrue();
    }
    
    public List<Entry> searchByKeywords(List<String> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return getAllEntries();
        }
        return repository.findByKeywords(keywords);
    }
    
    public Entry createEntry(Entry entry) {
        return repository.save(entry);
    }
    
    public Entry updateEntry(Long id, Entry updatedEntry) {
        Entry existingEntry = getEntryById(id);
        
        // Update fields
        existingEntry.setTitle(updatedEntry.getTitle());
        existingEntry.setType(updatedEntry.getType());
        existingEntry.setOrganization(updatedEntry.getOrganization());
        existingEntry.setLocation(updatedEntry.getLocation());
        existingEntry.setStartDate(updatedEntry.getStartDate());
        existingEntry.setEndDate(updatedEntry.getEndDate());
        existingEntry.setDescription(updatedEntry.getDescription());
        existingEntry.setBullets(updatedEntry.getBullets());
        existingEntry.setKeywords(updatedEntry.getKeywords());
        existingEntry.setUrls(updatedEntry.getUrls());
        existingEntry.setHighlight(updatedEntry.isHighlight());
        
        return repository.save(existingEntry);
    }
    
    public void deleteEntry(Long id) {
        repository.deleteById(id);
    }
}