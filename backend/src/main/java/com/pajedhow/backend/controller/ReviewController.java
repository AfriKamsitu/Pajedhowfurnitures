package com.pajedhow.backend.controller;

import com.pajedhow.backend.dto.MarketingDtos.ReviewResponse;
import com.pajedhow.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public published reviews for a given product. */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> forProduct(@PathVariable Long productId) {
        return reviewService.findPublishedForProduct(productId);
    }
}
