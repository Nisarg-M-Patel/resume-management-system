#!/bin/bash

echo "Checking what's using port 5432..."

# For macOS
if [[ "$(uname)" == "Darwin" ]]; then
  # Using lsof to find process using port 5432
  echo "Processes using port 5432:"
  sudo lsof -i :5432
  
  echo ""
  echo "If you see a PostgreSQL process already running, you can either:"
  echo "1. Use the existing PostgreSQL service (recommended)"
  echo "2. Stop the existing service with: brew services stop postgresql"
  echo "   or using the PostgreSQL app interface if you're using that"
fi

# For Linux
if [[ "$(uname)" == "Linux" ]]; then
  # Using netstat to find process using port 5432
  echo "Processes using port 5432:"
  sudo netstat -tulpn | grep :5432
  
  echo ""
  echo "If you see a PostgreSQL process already running, you can either:"
  echo "1. Use the existing PostgreSQL service (recommended)"
  echo "2. Stop the existing service with: sudo service postgresql stop"
fi

echo ""
echo "If you want to use the existing PostgreSQL:"
echo "1. Check if the 'resumeapp' database exists:"
echo "   psql -U postgres -c '\\l' | grep resumeapp"
echo ""
echo "2. If it doesn't exist, create it:"
echo "   psql -U postgres -c 'CREATE DATABASE resumeapp;'"