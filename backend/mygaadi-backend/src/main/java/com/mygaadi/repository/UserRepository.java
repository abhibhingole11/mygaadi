package com.mygaadi.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.mygaadi.entity.Role;
import com.mygaadi.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    long countByRole(Role role);

    
}
