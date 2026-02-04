package com.mygaadi.security;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private Key jwtKey;

    @PostConstruct
    public void init() {
        this.jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        System.out.println("in init method of jwt");
    }

    // ✅ Generate JWT Token
    public String generateToken(Authentication authentication) {

    	String username = authentication.getName();
    	System.out.println("username");

        String roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(username)   // email / username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .claim("roles", roles)
                .signWith(jwtKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Validate token & return Authentication object
    public Authentication validateToken(String token) {

        JwtParser parser = Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build();

        Claims claims = parser
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        
        String roles = claims.get("roles", String.class);
        System.out.println(roles);
        if(roles==null || roles.isEmpty()) {
        	throw new RuntimeException("jwt has not roles");
        }

        List<GrantedAuthority> authorities =
                AuthorityUtils.commaSeparatedStringToAuthorityList(roles);

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                authorities
        );
    }
}
