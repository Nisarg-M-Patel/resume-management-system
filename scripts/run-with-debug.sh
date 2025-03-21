#!/bin/bash

# Move to server directory
cd server

# Set Spring logging to debug level
export LOGGING_LEVEL_ROOT=DEBUG
export LOGGING_LEVEL_ORG_SPRINGFRAMEWORK=DEBUG
export LOGGING_LEVEL_COM_RESUMEAPP=DEBUG

# Run with Spring profile to show SQL
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.show-sql=true --spring.jpa.properties.hibernate.format_sql=true"

# Note: If the app exits quickly, the logs might not be visible.
# In that case, redirect output to a file:
# mvn spring-boot:run ... > spring-debug.log 2>&1