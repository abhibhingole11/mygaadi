package com.mygaadi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @PostConstruct
    public void logConnectionInfo() {
        // Obfuscate credentials for security if they are in the URL
        String sanitizedUrl = dbUrl.replaceAll(":[^/@]+@", ":****@");
        logger.info("====================================================");
        logger.info("DATABASE DIAGNOSTICS");
        logger.info("Attempting to connect to: {}", sanitizedUrl);

        if (dbUrl.contains("localhost")) {
            logger.warn("WARNING: You are trying to connect to 'localhost' in a deployed environment!");
            logger.warn("Ensure SPRING_DATASOURCE_URL is set correctly in Render/Vercel.");
        }
        logger.info("====================================================");
    }
}
