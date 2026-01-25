package com.mygaadi.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public String addCar(
            @RequestParam String make,
            @RequestParam String model,
            @RequestParam int year,
            @RequestParam double price,
            @RequestParam Long sellerId,
            @RequestParam("image") MultipartFile image
    ) {
        carService.addCar(make, model, year, price, sellerId, image);
        return "Car added successfully and waiting for admin approval";
    }
}
