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
