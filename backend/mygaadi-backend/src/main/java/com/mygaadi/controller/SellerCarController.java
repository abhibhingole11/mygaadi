package com.mygaadi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.mygaadi.entity.Car;
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
            @RequestParam("image") MultipartFile image) {
        carService.addCar(make, model, year, price, sellerId, image);
        return "Car added successfully and waiting for admin approval";
    }

    @GetMapping("/{sellerId}")
    public List<Car> getSellerCars(@PathVariable Long sellerId) {
        return carService.getSellerCars(sellerId);
    }

    @PutMapping("/update/{carId}")
    public String updateCar(
            @PathVariable Long carId,
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false, defaultValue = "0") int year,
            @RequestParam(required = false, defaultValue = "0.0") double price,
            @RequestParam(required = false) MultipartFile image) {
        carService.updateCar(carId, make, model, year, price, image);
        return "Car updated successfully";
    }

    @DeleteMapping("/delete/{carId}")
    public String deleteCar(@PathVariable Long carId) {
        carService.deleteCar(carId);
        return "Car deleted successfully";
    }
}
