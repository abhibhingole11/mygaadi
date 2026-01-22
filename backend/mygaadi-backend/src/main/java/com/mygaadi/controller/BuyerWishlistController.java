package com.mygaadi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.mygaadi.dto.AddWishlistRequest;
import com.mygaadi.dto.WishlistResponse;
import com.mygaadi.service.WishlistService;

@RestController
@RequestMapping("/api/buyer/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class BuyerWishlistController {

    private final WishlistService wishlistService;

    public BuyerWishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ➕ Add to wishlist
//    @PostMapping
//    public String addToWishlist(@RequestBody AddWishlistRequest request) {
//        wishlistService.addToWishlist(request);
//        return "Added to wishlist";
//    }
    @PostMapping
    public String addToWishlist(@RequestBody AddWishlistRequest request) {
        System.out.println("WISHLIST REQUEST → buyerId=" 
            + request.buyerId + ", carId=" + request.carId);
        wishlistService.addToWishlist(request);
        return "Added to wishlist";
    }


    // 📄 View wishlist
    @GetMapping("/{buyerId}")
    public List<WishlistResponse> getWishlist(@PathVariable Long buyerId) {
        return wishlistService.getWishlist(buyerId);
    }

    // ❌ Remove from wishlist
    @DeleteMapping("/{wishlistId}")
    public String removeFromWishlist(@PathVariable Long wishlistId) {
        wishlistService.removeFromWishlist(wishlistId);
        return "Removed from wishlist";
    }
}
