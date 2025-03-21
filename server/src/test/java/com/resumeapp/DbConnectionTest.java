package com.resumeapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Simple class to test database connectivity.
 * Save this as server/src/test/java/com/resumeapp/DbConnectionTest.java
 * Run with: cd server && mvn -q exec:java -Dexec.mainClass="com.resumeapp.DbConnectionTest"
 */
public class DbConnectionTest {

    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/resumeapp";
        String username = "postgres";
        String password = "postgres";

        System.out.println("Testing connection to PostgreSQL at " + url);
        
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println("Database connection test successful!");
            connection.close();
        } catch (SQLException e) {
            System.out.println("Database connection failed!");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}