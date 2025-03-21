#!/bin/bash

echo "Checking for existing PostgreSQL container..."

# Check if the container exists
if docker ps -a | grep -q "resume-postgres"; then
  echo "Found existing resume-postgres container."
  
  # Check if the container is running
  if docker ps | grep -q "resume-postgres"; then
    echo "Container is already running."
  else
    echo "Container exists but is not running. Starting it..."
    docker start resume-postgres
  fi
else
  echo "No existing container found. Creating new PostgreSQL container..."
  docker run --name resume-postgres -e POSTGRES_DB=resumeapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if container is running correctly
if docker ps | grep -q "resume-postgres"; then
  echo "PostgreSQL container is running successfully on port 5432."
  echo "Database: resumeapp"
  echo "Username: postgres"
  echo "Password: postgres"
else
  echo "Failed to start PostgreSQL container."
fi