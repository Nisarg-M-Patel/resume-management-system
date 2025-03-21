#!/bin/bash

echo "Setting up using your local PostgreSQL server..."

# Check if psql command is available
if command -v psql &> /dev/null; then
    echo "PostgreSQL client tools are available."
    
    # Try to connect with default settings
    if psql -U postgres -c "SELECT 1" &> /dev/null; then
        echo "Successfully connected to PostgreSQL with user 'postgres'."
        
        # Check if the database exists
        if psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'resumeapp'" | grep -q 1; then
            echo "Database 'resumeapp' already exists."
        else
            echo "Creating database 'resumeapp'..."
            psql -U postgres -c "CREATE DATABASE resumeapp"
        fi
        
    else
        echo "Could not connect to PostgreSQL with user 'postgres'."
        echo "Please try: "
        echo "1. If using a different username: edit this script"
        echo "2. If authentication fails: check PostgreSQL configuration"
    fi
    
else
    echo "PostgreSQL client tools (psql) not found."
    echo "You can install them with: "
    echo "  - On macOS: brew install postgresql"
    echo "  - On Ubuntu/Debian: sudo apt install postgresql-client"
    
    echo ""
    echo "Alternatively, you can update your application.properties to point to your database:"
    echo "1. Edit server/src/main/resources/application.properties"
    echo "2. Update the spring.datasource.* properties to match your database configuration"
fi

echo ""
echo "After ensuring the database exists, try running the Spring Boot app:"
echo "cd server && mvn spring-boot:run"