package com.mygaadi.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mygaadi.service.CloudinaryService;

@RestController
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    public ImageUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/api/upload")
    public String uploadImage(@RequestParam("image") MultipartFile image) {
        return cloudinaryService.uploadImage(image);
    }
}
