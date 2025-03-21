#!/bin/bash

echo "===== Resume Management System Setup and Run ====="
echo "This script will set up your environment and run the application."
echo ""

# Check port usage
echo "Step 1: Checking PostgreSQL port usage..."
./scripts/check-port.sh

# Setup local database
echo "Step 2: Setting up local database..."
./scripts/setup-local-db.sh

# Update application properties
echo "Step 3: Updating application properties..."
./scripts/update-app-properties.sh

# Check compilation
echo "Step 4: Checking Java compilation..."
./scripts/check-compile.sh

# Run the application
echo "Step 5: Running the application..."
cd server && mvn spring-boot:run
