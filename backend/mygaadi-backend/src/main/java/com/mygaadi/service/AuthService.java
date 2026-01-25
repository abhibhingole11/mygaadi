package com.mygaadi.service;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mygaadi.dto.LoginRequest;
import com.mygaadi.dto.LoginResponse;
import com.mygaadi.dto.RegisterRequest;
import com.mygaadi.entity.User;
import com.mygaadi.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // 🔐 Password validation regex
    private static final String PASSWORD_REGEX =
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile(PASSWORD_REGEX);

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= REGISTER =================
    public void register(RegisterRequest request) {

        // 🔴 Email already exists
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email already exists"
            );
        }

        // 🔐 Password validation
        if (!PASSWORD_PATTERN.matcher(request.password).matches()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            );
        }

        User user = new User();
        user.setEmail(request.email);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setPassword(request.password); // plain for now
        user.setRole(request.role);
        user.setRestricted(false); // ✅ IMPORTANT

        userRepository.save(user);
    }

    // ================= LOGIN =================
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                    )
                );

        // 🔒 Restricted user check (NULL SAFE)
        if (Boolean.TRUE.equals(user.getRestricted())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "User is restricted by admin"
            );
        }

        // 🔑 Password check
        if (!user.getPassword().equals(request.password)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
            );
        }

        LoginResponse response = new LoginResponse();
        response.userId = user.getUserId();
        response.email = user.getEmail();
        response.firstName = user.getFirstName();
        response.role = user.getRole();

        return response;
    }
}
