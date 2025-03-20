package com.resumeapp.controller;

import com.resumeapp.model.Entry;
import com.resumeapp.service.EntryService;
import com.resumeapp.service.SemanticSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ResumeController {

    private final EntryService entryService;
    private final SemanticSearchService semanticSearchService;

    @Autowired
    public ResumeController(EntryService entryService, SemanticSearchService semanticSearchService) {
        this.entryService = entryService;
        this.semanticSearchService = semanticSearchService;
    }

    /**
     * Generate a tailored resume based on a job description
     * 
     * @param requestBody Contains the job description and optional parameters
     * @return List of relevant resume entries
     */
    @PostMapping("/generate")
    public ResponseEntity<List<Entry>> generateResume(@RequestBody Map<String, Object> requestBody) {
        String jobDescription = (String) requestBody.get("jobDescription");
        Integer maxEntries = (Integer) requestBody.getOrDefault("maxEntries", 10);
        
        if (jobDescription == null || jobDescription.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Entry> entries = semanticSearchService.findBestMatches(jobDescription, maxEntries);
        return ResponseEntity.ok(entries);
    }

    /**
     * Extract keywords from a job description
     * 
     * @param requestBody Contains the job description
     * @return List of extracted keywords
     */
    @PostMapping("/extract-keywords")
    public ResponseEntity<List<String>> extractKeywords(@RequestBody Map<String, String> requestBody) {
        String jobDescription = requestBody.get("jobDescription");
        
        if (jobDescription == null || jobDescription.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<String> keywords = semanticSearchService.extractKeywords(jobDescription);
        return ResponseEntity.ok(keywords);
    }
}