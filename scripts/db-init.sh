#!/bin/bash

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432
if [ $? -ne 0 ]; then
  echo "PostgreSQL is not running on localhost:5432"
  echo "Starting PostgreSQL using Docker..."
  
  # Start PostgreSQL using Docker
  docker run --name resume-postgres -e POSTGRES_DB=resumeapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
  
  # Wait for PostgreSQL to start
  echo "Waiting for PostgreSQL to start..."
  sleep 10
else
  echo "PostgreSQL is already running on localhost:5432"
fi

# Create the database if it doesn't exist
PGPASSWORD=postgres psql -h localhost -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'resumeapp'" | grep -q 1
if [ $? -ne 0 ]; then
  echo "Creating database 'resumeapp'..."
  PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE resumeapp"
else
  echo "Database 'resumeapp' already exists"
fi

echo "Database setup complete!"