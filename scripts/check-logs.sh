#!/bin/bash

# Change to the server directory
cd server

# Run Maven with debug logging
mvn spring-boot:run -X > spring-boot-debug.log 2>&1

# Display the last 50 lines of the log to see the error
echo "Displaying last 50 lines of the log:"
tail -n 50 spring-boot-debug.log