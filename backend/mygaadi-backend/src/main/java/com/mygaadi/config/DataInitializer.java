package com.mygaadi.config;

import com.mygaadi.entity.Role;
import com.mygaadi.entity.User;
import com.mygaadi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@mygaadi.com";
        String adminPassword = "admin123";

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode(adminPassword));
                    user.setRole(Role.ADMIN);
                    user.setRestricted(false);
                    userRepository.save(user);
                    System.out.println("Default admin user password reset/updated: " + adminEmail);
                },
                () -> {
                    User admin = new User();
                    admin.setEmail(adminEmail);
                    admin.setFirstName("Admin");
                    admin.setLastName("User");
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    admin.setRole(Role.ADMIN);
                    admin.setRestricted(false);
                    userRepository.save(admin);
                    System.out.println("Default admin user created: " + adminEmail + " / " + adminPassword);
                });
    }
}
