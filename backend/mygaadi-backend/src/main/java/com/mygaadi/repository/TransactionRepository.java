package com.mygaadi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mygaadi.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
