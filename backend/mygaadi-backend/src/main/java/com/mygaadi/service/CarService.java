package com.mygaadi.service;

import java.util.List;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mygaadi.dto.AdminCarResponse;
import com.mygaadi.dto.BuyerCarResponse;
import com.mygaadi.entity.Car;
import com.mygaadi.entity.CarStatus;
import com.mygaadi.entity.Transaction;
import com.mygaadi.entity.User;
import com.mygaadi.repository.CarRepository;
import com.mygaadi.repository.TransactionRepository;
import com.mygaadi.repository.UserRepository;
import com.mygaadi.repository.WishlistRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final WishlistRepository wishlistRepository;
    private final CloudinaryService cloudinaryService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public CarService(CarRepository carRepository, UserRepository userRepository,
            TransactionRepository transactionRepository, WishlistRepository wishlistRepository,
            CloudinaryService cloudinaryService, RazorpayClient razorpayClient) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.wishlistRepository = wishlistRepository;
        this.cloudinaryService = cloudinaryService;
        this.razorpayClient = razorpayClient;
    }

    public List<Car> getPendingCars() {
        return carRepository.findByStatus(CarStatus.PENDING);
    }

    public void addCar(
            String make,
            String model,
            int year,
            double price,
            Long sellerId,
            MultipartFile image) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // upload image to Cloudinary
        String imageUrl = cloudinaryService.uploadImage(image);

        Car car = new Car();
        car.setMake(make);
        car.setModel(model);
        car.setYear(year);
        car.setPrice(price);
        car.setSeller(seller);
        car.setImageUrl(imageUrl);
        car.setStatus(CarStatus.PENDING);

        carRepository.save(car);
    }

    public void approveCar(Long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
        car.setStatus(CarStatus.APPROVED);
        carRepository.save(car);
    }

    public void rejectCar(Long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
        car.setStatus(CarStatus.REJECTED);
        carRepository.save(car);

    }

    public List<BuyerCarResponse> getApprovedCars() {
        return carRepository.findByStatus(CarStatus.APPROVED).stream()
                .map(car -> {
                    BuyerCarResponse dto = new BuyerCarResponse();
                    dto.carId = car.getCarId();
                    dto.make = car.getMake();
                    dto.model = car.getModel();
                    dto.year = car.getYear();
                    dto.price = car.getPrice();
                    dto.fuelType = car.getFuelType();
                    dto.transmission = car.getTransmission();
                    dto.sellerName = car.getSeller().getFirstName();
                    dto.imageUrl = car.getImageUrl();
                    return dto;
                }).collect(Collectors.toList());

    }

    public List<BuyerCarResponse> getCarsByFilters(
            String keyword, Double maxPrice, Integer minYear) {

        List<Car> cars;

        if (keyword != null && !keyword.isBlank()) {
            cars = carRepository
                    .findByStatusAndMakeContainingIgnoreCaseOrStatusAndModelContainingIgnoreCase(
                            CarStatus.APPROVED, keyword,
                            CarStatus.APPROVED, keyword);

        } else if (maxPrice != null) {
            cars = carRepository
                    .findByStatusAndPriceLessThanEqual(CarStatus.APPROVED, maxPrice);

        } else if (minYear != null) {
            cars = carRepository
                    .findByStatusAndYearGreaterThanEqual(CarStatus.APPROVED, minYear);

        } else {
            cars = carRepository.findByStatus(CarStatus.APPROVED);
        }

        return cars.stream()
                .map(car -> {
                    BuyerCarResponse dto = new BuyerCarResponse();
                    dto.carId = car.getCarId();
                    dto.make = car.getMake();
                    dto.model = car.getModel();
                    dto.year = car.getYear();
                    dto.price = car.getPrice();
                    dto.fuelType = car.getFuelType();
                    dto.transmission = car.getTransmission();
                    dto.imageUrl = car.getImageUrl();
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void buyCar(Long buyerId, Long carId) {

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getStatus() != CarStatus.APPROVED) {
            throw new RuntimeException("Car is not available");
        }

        // mark car sold
        car.setStatus(CarStatus.SOLD);
        carRepository.save(car);

        // save transaction
        Transaction tx = new Transaction();
        tx.setBuyer(buyer);
        tx.setCar(car);
        transactionRepository.save(tx);

        // remove from wishlist
        wishlistRepository.findByBuyerAndCar(buyer, car)
                .ifPresent(wishlistRepository::delete);
    }

    public String createOrder(Long carId, Double totalAmount) {
        try {
            // NOTE: Razorpay TEST mode has a transaction limit (usually ₹5,00,000).
            // To ensure car purchases work for the demo, we cap the actual payment amount
            // at ₹50,000 if the car is more expensive.
            long amountInPaise = (long) (Math.round(totalAmount * 100));
            if (amountInPaise > 5000000) {
                amountInPaise = 5000000; // Cap at ₹50,000 for Demo/Test
            }

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + carId + "_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            return order.get("id");
        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(attributes, razorpaySecret);
        } catch (Exception e) {
            return false;
        }
    }

    public List<AdminCarResponse> getAllCars() {

        return carRepository.findAll()
                .stream()
                .map(car -> {
                    AdminCarResponse dto = new AdminCarResponse();
                    dto.carId = car.getCarId();
                    dto.make = car.getMake();
                    dto.model = car.getModel();
                    dto.price = car.getPrice();
                    dto.year = car.getYear();
                    dto.status = car.getStatus().name();
                    return dto;
                })
                .toList();
    }

    public List<Car> getSellerCars(Long sellerId) {
        return carRepository.findBySeller_UserId(sellerId);
    }

    public void updateCar(Long carId, String make, String model, int year, double price, MultipartFile image) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (make != null && !make.isEmpty())
            car.setMake(make);
        if (model != null && !model.isEmpty())
            car.setModel(model);
        if (year > 0)
            car.setYear(year);
        if (price > 0)
            car.setPrice(price);

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            car.setImageUrl(imageUrl);
        }

        carRepository.save(car);
    }

    public void deleteCar(Long carId) {
        if (!carRepository.existsById(carId)) {
            throw new RuntimeException("Car not found");
        }
        carRepository.deleteById(carId);
    }

    public List<com.mygaadi.dto.SellerSalesResponse> getSellerSales(Long sellerId) {
        return transactionRepository.findByCar_Seller_UserId(sellerId)
                .stream()
                .map(tx -> {
                    com.mygaadi.dto.SellerSalesResponse dto = new com.mygaadi.dto.SellerSalesResponse();
                    dto.transactionId = tx.getTransactionId();
                    dto.carMake = tx.getCar().getMake();
                    dto.carModel = tx.getCar().getModel();
                    dto.carPrice = tx.getCar().getPrice();
                    dto.buyerName = tx.getBuyer().getFirstName() + " " + tx.getBuyer().getLastName();
                    dto.buyerEmail = tx.getBuyer().getEmail();
                    dto.buyerPhone = tx.getBuyer().getPhone();
                    dto.purchasedAt = tx.getPurchasedAt();
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
