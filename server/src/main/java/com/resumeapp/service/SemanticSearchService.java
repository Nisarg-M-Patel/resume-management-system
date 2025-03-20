package com.resumeapp.service;

import com.resumeapp.model.Entry;
import com.resumeapp.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SemanticSearchService {

    private final EntryRepository entryRepository;

    @Autowired
    public SemanticSearchService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    /**
     * Extract keywords from a job description
     * 
     * @param jobDescription The job description text
     * @return List of extracted keywords
     */
    public List<String> extractKeywords(String jobDescription) {
        if (jobDescription == null || jobDescription.isEmpty()) {
            return Collections.emptyList();
        }

        // Convert to lowercase
        String text = jobDescription.toLowerCase();
        
        // Common tech keywords to look for (expand this list as needed)
        Set<String> techKeywords = new HashSet<>(Arrays.asList(
            "java", "spring", "spring boot", "postgresql", "sql", "database", 
            "rest", "api", "microservices", "docker", "kubernetes", "cloud",
            "aws", "azure", "gcp", "react", "angular", "vue", "javascript",
            "typescript", "node", "express", "nosql", "mongodb", "redis",
            "git", "ci/cd", "jenkins", "agile", "scrum", "devops", "testing",
            "junit", "selenium", "frontend", "backend", "fullstack", "web",
            "mobile", "android", "ios", "design patterns", "algorithms",
            "data structures", "security", "performance", "scalability",
            "html", "css", "sass", "less", "responsive", "ui", "ux"
        ));
        
        // Look for specific skills and technologies
        Set<String> extractedKeywords = new HashSet<>();
        for (String keyword : techKeywords) {
            if (text.contains(keyword)) {
                extractedKeywords.add(keyword);
            }
        }
        
        // Extract years of experience requirements
        Pattern expPattern = Pattern.compile("(\\d+)\\+?\\s+years?\\s+(?:of\\s+)?experience(?:\\s+in\\s+|\\s+with\\s+)([a-zA-Z0-9#+\\s]+)");
        Matcher expMatcher = expPattern.matcher(text);
        while (expMatcher.find()) {
            String skill = expMatcher.group(2).trim().toLowerCase();
            extractedKeywords.add(skill);
        }
        
        // Extract degree requirements
        Pattern degreePattern = Pattern.compile("(bachelor'?s|master'?s|phd|doctorate|bs|ms|ba|ma)\\s+(?:degree\\s+)?(?:in\\s+)?([a-zA-Z\\s]+)");
        Matcher degreeMatcher = degreePattern.matcher(text);
        while (degreeMatcher.find()) {
            String field = degreeMatcher.group(2).trim().toLowerCase();
            extractedKeywords.add(field + " degree");
        }
        
        return new ArrayList<>(extractedKeywords);
    }

    /**
     * Find the best matching entries for a given job description
     * 
     * @param jobDescription The job description text
     * @param maxEntries Maximum number of entries to return
     * @return List of entries sorted by relevance
     */
    public List<Entry> findBestMatches(String jobDescription, int maxEntries) {
        List<String> keywords = extractKeywords(jobDescription);
        if (keywords.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Get entries that match the keywords
        List<Entry> matches = entryRepository.findByKeywords(keywords);
        
        // Rank entries by number of matching keywords
        Map<Entry, Integer> entriesWithMatchCount = new HashMap<>();
        for (Entry entry : matches) {
            int matchCount = 0;
            for (String keyword : keywords) {
                if (entry.getKeywords().contains(keyword)) {
                    matchCount++;
                }
            }
            entriesWithMatchCount.put(entry, matchCount);
        }
        
        // Sort by match count (descending) and limit to maxEntries
        return entriesWithMatchCount.entrySet().stream()
                .sorted(Map.Entry.<Entry, Integer>comparingByValue().reversed())
                .limit(maxEntries)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}