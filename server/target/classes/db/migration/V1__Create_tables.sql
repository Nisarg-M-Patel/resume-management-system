-- V1__Create_tables.sql

CREATE TABLE resume_entries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    organization VARCHAR(255),
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    highlight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entry_bullets (
    entry_id INT NOT NULL,
    bullet TEXT NOT NULL,
    PRIMARY KEY (entry_id, bullet),
    FOREIGN KEY (entry_id) REFERENCES resume_entries(id) ON DELETE CASCADE
);

CREATE TABLE entry_keywords (
    entry_id INT NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    PRIMARY KEY (entry_id, keyword),
    FOREIGN KEY (entry_id) REFERENCES resume_entries(id) ON DELETE CASCADE
);

CREATE TABLE entry_urls (
    entry_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    PRIMARY KEY (entry_id, url),
    FOREIGN KEY (entry_id) REFERENCES resume_entries(id) ON DELETE CASCADE
);

-- Add basic indexes
CREATE INDEX idx_entries_type ON resume_entries(type);
CREATE INDEX idx_entries_highlight ON resume_entries(highlight);