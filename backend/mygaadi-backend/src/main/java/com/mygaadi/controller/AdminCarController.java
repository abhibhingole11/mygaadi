package com.mygaadi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.mygaadi.dto.AdminCarResponse;
import com.mygaadi.entity.Car;
import com.mygaadi.service.CarService;

@RestController
@RequestMapping("/api/admin/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminCarController {

    private final CarService carService;

    public AdminCarController(CarService carService) {
        this.carService = carService;
    }
    @GetMapping()
    public List<AdminCarResponse>getAllCars(){
    	return carService.getAllCars();
    }

    // 1️⃣ Get all pending cars
    @GetMapping("/pending")
    public List<Car> getPendingCars() {
      return carService.getPendingCars();
      
    }
    
    @PutMapping("/{carId}/approve")
    public String approveCar(@PathVariable Long carId) {
    	carService.approveCar(carId);
    	return "car approved successfully";
    }
    @PutMapping("/{carId}/reject")
    public String rejectCar(@PathVariable Long carId) {
    	carService.rejectCar(carId);
    	return "car rejected successfully";
    }
}
