#!/bin/bash

echo "Updating Spring Boot application properties..."

# Path to application.properties
APP_PROPS="server/src/main/resources/application.properties"

# Backup original file
cp "$APP_PROPS" "${APP_PROPS}.backup"
echo "Created backup at ${APP_PROPS}.backup"

echo ""
echo "Current PostgreSQL configuration in application.properties:"
grep "spring.datasource" "$APP_PROPS"

echo ""
echo "Please enter your PostgreSQL connection details (press Enter to keep default values):"

# Get user input with defaults
read -p "Database URL [jdbc:postgresql://localhost:5432/resumeapp]: " DB_URL
DB_URL=${DB_URL:-jdbc:postgresql://localhost:5432/resumeapp}

read -p "Username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Password [postgres]: " DB_PASS
DB_PASS=${DB_PASS:-postgres}

# Update application.properties
sed -i.bak "s|spring.datasource.url=.*|spring.datasource.url=${DB_URL}|g" "$APP_PROPS"
sed -i.bak "s|spring.datasource.username=.*|spring.datasource.username=${DB_USER}|g" "$APP_PROPS"
sed -i.bak "s|spring.datasource.password=.*|spring.datasource.password=${DB_PASS}|g" "$APP_PROPS"

echo ""
echo "Updated database configuration in application.properties:"
grep "spring.datasource" "$APP_PROPS"

# Update Flyway migration mode to be safer
if grep -q "spring.flyway.baseline-on-migrate" "$APP_PROPS"; then
    echo "Flyway baseline-on-migrate already configured."
else
    echo ""
    echo "Adding Flyway baseline-on-migrate=true for safer database migrations..."
    echo "spring.flyway.baseline-on-migrate=true" >> "$APP_PROPS"
fi

echo ""
echo "Configuration updated. Try running the application:"
echo "cd server && mvn spring-boot:run"