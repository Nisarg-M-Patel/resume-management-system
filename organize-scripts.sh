#!/bin/bash

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Move existing scripts to the scripts directory
mv check-logs.sh scripts/ 2>/dev/null
mv db-init.sh scripts/ 2>/dev/null
mv check-compile.sh scripts/ 2>/dev/null
mv fix-postgres.sh scripts/ 2>/dev/null
mv check-port.sh scripts/ 2>/dev/null
mv setup-local-db.sh scripts/ 2>/dev/null
mv update-app-properties.sh scripts/ 2>/dev/null
mv test-db-connection.java scripts/ 2>/dev/null
mv run-with-debug.sh scripts/ 2>/dev/null

# Make all scripts executable
chmod +x scripts/*.sh

# Create a README file
cat > scripts/README.md << 'EOF'
# Debugging and Setup Scripts

This directory contains utility scripts for setting up and debugging the Resume Management Application.

## Database Scripts
- `check-port.sh` - Identifies processes using PostgreSQL port (5432)
- `setup-local-db.sh` - Sets up the database using local PostgreSQL installation
- `fix-postgres.sh` - Manages PostgreSQL Docker container
- `db-init.sh` - Initial database setup script

## Application Scripts
- `check-compile.sh` - Checks for Java compilation issues
- `run-with-debug.sh` - Runs Spring Boot with debug logging
- `update-app-properties.sh` - Updates application.properties with correct database settings

## Testing Scripts
- `check-logs.sh` - Captures detailed Spring Boot logs
- `test-db-connection.java` - Tests database connectivity

## Usage

Most scripts can be run from the project root directory:

```bash
./scripts/script-name.sh
```

For Java test files:
```bash
# Make sure to place the Java file in the correct package structure first
cp scripts/test-db-connection.java server/src/test/java/com/resumeapp/DbConnectionTest.java
cd server
mvn -q exec:java -Dexec.mainClass="com.resumeapp.DbConnectionTest"
```
EOF

# Create a convenience script to run all setup steps in sequence
cat > scripts/setup-and-run.sh << 'EOF'
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
EOF

chmod +x scripts/setup-and-run.sh

echo "Scripts organized in the 'scripts' directory."
echo "Added a README.md file with usage instructions."
echo "Created a setup-and-run.sh master script to execute all setup steps."
echo ""
echo "To run the complete setup process: ./scripts/setup-and-run.sh"