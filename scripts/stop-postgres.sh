#!/bin/bash
# scripts/stop-postgres.sh - Script to stop local PostgreSQL instance

# Function to check if PostgreSQL is running on port 5432
check_postgres() {
  nc -z localhost 5432 > /dev/null 2>&1
  return $?
}

# Function to stop PostgreSQL based on different methods
stop_postgres() {
  echo "Attempting to stop PostgreSQL running on port 5432..."
  
  # Try brew services first (for macOS)
  if command -v brew &> /dev/null && brew services list | grep -q postgresql; then
    echo "Stopping PostgreSQL via brew services..."
    brew services stop postgresql
    return $?
  fi
  
  # Try systemctl (for Linux)
  if command -v systemctl &> /dev/null; then
    echo "Stopping PostgreSQL via systemctl..."
    sudo systemctl stop postgresql
    return $?
  fi
  
  # Try pg_ctl directly
  if command -v pg_ctl &> /dev/null; then
    echo "Stopping PostgreSQL via pg_ctl..."
    # Try common data directory locations
    for pgdata in /usr/local/var/postgres /var/lib/postgresql/data $PGDATA; do
      if [ -d "$pgdata" ]; then
        pg_ctl -D "$pgdata" stop
        return $?
      fi
    done
  fi
  
  echo "Could not automatically stop PostgreSQL. You may need to stop it manually."
  return 1
}

# Main execution
if check_postgres; then
  echo "PostgreSQL is running on port 5432."
  stop_postgres
  
  # Wait for PostgreSQL to fully stop
  echo "Waiting for PostgreSQL to stop completely..."
  for i in {1..10}; do
    if ! check_postgres; then
      echo "PostgreSQL has been stopped successfully."
      break
    fi
    echo "Still waiting... ($i/10)"
    sleep 1
  done
  
  if check_postgres; then
    echo "WARNING: PostgreSQL is still running. You may need to stop it manually."
    echo "You can try one of these commands:"
    echo "  - brew services stop postgresql"
    echo "  - sudo systemctl stop postgresql"
    echo "  - pg_ctl -D /your/data/directory stop"
    exit 1
  fi
else
  echo "PostgreSQL is not running on port 5432. No need to stop it."
fi

echo "Done. You can now run Docker Compose from the root directory."