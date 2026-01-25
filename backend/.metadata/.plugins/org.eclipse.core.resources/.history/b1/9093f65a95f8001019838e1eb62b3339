package com.mygaadi.controller;

import org.springframework.web.bind.annotation.*;

import com.mygaadi.dto.AddCarRequest;
import com.mygaadi.service.CarService;

@RestController
@RequestMapping("/api/seller/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerCarController {

    private final CarService carService;

    public SellerCarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    public String addCar(@RequestBody AddCarRequest request) {
        carService.addCar(request);
        return "Car added successfully and waiting for admin approval";
    }
}
