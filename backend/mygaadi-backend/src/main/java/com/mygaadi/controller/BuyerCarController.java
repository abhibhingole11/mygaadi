package com.mygaadi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.mygaadi.service.CarService;
import com.mygaadi.dto.BuyerCarResponse;
import com.mygaadi.entity.*;

@RestController
@RequestMapping("/api/buyer/cars")
public class BuyerCarController {
	private final CarService carService;

	public BuyerCarController(CarService carService) {
		this.carService = carService;
	}

	@GetMapping
	public List<BuyerCarResponse> getApprovedCars() {
		return carService.getApprovedCars();
	}

	@GetMapping("/search")
	public List<BuyerCarResponse> searchCars(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Double maxPrice,
			@RequestParam(required = false) Integer minYear) {

		return carService.getCarsByFilters(keyword, maxPrice, minYear);
	}

}
