#!/bin/bash

# Change to the server directory
cd server

# Clean and compile
echo "Cleaning and compiling Java code..."
mvn clean compile -e

# Check if compilation was successful
if [ $? -eq 0 ]; then
  echo "Compilation successful!"
else
  echo "Compilation failed. See the errors above."
fi