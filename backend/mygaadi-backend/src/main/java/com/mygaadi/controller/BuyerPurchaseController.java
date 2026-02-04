package com.mygaadi.controller;

import org.springframework.web.bind.annotation.*;

import com.mygaadi.dto.PaymentVerifyRequest;
import com.mygaadi.service.CarService;

@RestController
@RequestMapping("/api/buyer/buy")
@CrossOrigin(origins = "http://localhost:5173")
public class BuyerPurchaseController {

    private final CarService carService;

    public BuyerPurchaseController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("/create-order/{carId}")
    public String createOrder(@PathVariable Long carId) {
        return carService.createOrder(carId);
    }

    @PostMapping("/verify")
    public String verifyPayment(@RequestBody PaymentVerifyRequest request) {
        boolean isValid = carService.verifyPayment(
                request.razorpayOrderId,
                request.razorpayPaymentId,
                request.razorpaySignature);

        if (isValid) {
            carService.buyCar(request.buyerId, request.carId);
            return "Payment verified and car purchased successfully";
        } else {
            throw new RuntimeException("Invalid payment signature");
        }
    }
}
