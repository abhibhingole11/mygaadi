package com.mygaadi.controller;

import org.springframework.web.bind.annotation.*;

import com.mygaadi.dto.BuyCarRequest;
import com.mygaadi.service.CarService;

@RestController
@RequestMapping("/api/buyer/buy")
@CrossOrigin(origins = "http://localhost:5173")
public class BuyerPurchaseController {

    private final CarService carService;

    public BuyerPurchaseController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    public String buyCar(@RequestBody BuyCarRequest request) {
        carService.buyCar(request.buyerId, request.carId);
        return "Car purchased successfully";
    }
}
