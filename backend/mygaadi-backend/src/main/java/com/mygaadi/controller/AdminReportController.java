package com.mygaadi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mygaadi.entity.CarStatus;
import com.mygaadi.entity.Role;
import com.mygaadi.repository.CarRepository;
import com.mygaadi.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public AdminReportController(UserRepository userRepository,
            CarRepository carRepository) {
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("buyers", userRepository.countByRole(Role.BUYER));
        stats.put("sellers", userRepository.countByRole(Role.SELLER));

        stats.put("totalCars", carRepository.count());
        stats.put("soldCars", carRepository.countByStatus(CarStatus.SOLD));
        stats.put("availableCars",
                carRepository.countByStatus(CarStatus.APPROVED));

        return stats;
    }
}
