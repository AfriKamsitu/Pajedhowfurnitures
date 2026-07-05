package com.pajedhow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/** Coupons, banners and reviews DTOs. */
public final class MarketingDtos {

    private MarketingDtos() {}

    // ---- Coupons ----
    public record CouponResponse(
            Long id,
            String code,
            String discountType,
            BigDecimal discountValue,
            Integer usageLimit,
            Integer usageCount,
            LocalDate validUntil,
            String status
    ) {}

    public record CouponRequest(
            @NotBlank String code,
            @NotBlank String discountType,  // PERCENTAGE | FIXED | FREE_SHIPPING
            BigDecimal discountValue,
            Integer usageLimit,
            LocalDate validUntil,
            String status
    ) {}

    // ---- Banners ----
    public record BannerResponse(
            Long id,
            String title,
            String location,
            String image,
            String status
    ) {}

    public record BannerRequest(
            @NotBlank String title,
            String location,
            String image,
            String status
    ) {}

    // ---- Reviews ----
    public record ReviewResponse(
            Long id,
            String customerName,
            Long productId,
            String productName,
            Integer rating,
            String comment,
            String status,
            Instant createdAt
    ) {}

    public record ReviewRequest(
            @NotNull Long productId,
            @NotNull Integer rating,
            String comment
    ) {}

    public record ReviewStatusRequest(
            @NotBlank String status  // PUBLISHED | PENDING
    ) {}
}
