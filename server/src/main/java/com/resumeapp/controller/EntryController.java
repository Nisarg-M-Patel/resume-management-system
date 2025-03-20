package com.resumeapp.controller;

import com.resumeapp.model.Entry;
import com.resumeapp.service.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class EntryController {

    private final EntryService service;
    
    @Autowired
    public EntryController(EntryService service) {
        this.service = service;
    }
    
    @GetMapping
    public List<Entry> getAllEntries() {
        return service.getAllEntries();
    }
    
    @GetMapping("/{id}")
    public Entry getEntryById(@PathVariable Long id) {
        return service.getEntryById(id);
    }
    
    @GetMapping("/type/{type}")
    public List<Entry> getEntriesByType(@PathVariable String type) {
        return service.getEntriesByType(Entry.EntryType.valueOf(type.toUpperCase()));
    }
    
    @GetMapping("/highlights")
    public List<Entry> getHighlightedEntries() {
        return service.getHighlightedEntries();
    }
    
    @GetMapping("/search")
    public List<Entry> searchByKeywords(@RequestParam(required = false) List<String> keywords) {
        return service.searchByKeywords(keywords);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Entry createEntry(@RequestBody Entry entry) {
        return service.createEntry(entry);
    }
    
    @PutMapping("/{id}")
    public Entry updateEntry(@PathVariable Long id, @RequestBody Entry entry) {
        return service.updateEntry(id, entry);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEntry(@PathVariable Long id) {
        service.deleteEntry(id);
    }
}