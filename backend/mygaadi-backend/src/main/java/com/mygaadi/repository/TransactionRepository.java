package com.mygaadi.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mygaadi.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCar_Seller_UserId(Long sellerId);
}
