package com.mygaadi.service;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mygaadi.dto.LoginRequest;
import com.mygaadi.dto.LoginResponse;
import com.mygaadi.dto.RegisterRequest;
import com.mygaadi.entity.User;
import com.mygaadi.repository.UserRepository;
import com.mygaadi.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // 🔐 Password validation regex
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    public AuthService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER =================
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already exists");
        }

        if (!PASSWORD_PATTERN.matcher(request.password).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain upper, lower, number & special char");
        }

        User user = new User();
        user.setEmail(request.email);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);

        // 🔐 HASH PASSWORD
        user.setPassword(passwordEncoder.encode(request.password));

        user.setRole(request.role);
        user.setRestricted(false);

        userRepository.save(user);
    }

    // ================= LOGIN (AuthenticationManager + JWT) =================
    public LoginResponse login(LoginRequest request) {

        System.out.println("Attempting login for email: " + request.email);
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email,
                            request.password));
            System.out.println("Authentication successful for: " + request.email);
        } catch (Exception e) {
            System.err.println("Authentication failed for: " + request.email + " - Error: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // 🔑 Generate JWT
        String token = jwtUtil.generateToken(authentication);

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"));

        LoginResponse response = new LoginResponse();
        response.userId = user.getUserId();
        response.email = user.getEmail();
        response.firstName = user.getFirstName();
        response.role = user.getRole();
        response.token = token;

        return response;
    }
}
