package com.pajedhow.backend.entity.enums;

/**
 * Shared enums for the domain. Kept in one file for convenience since each is
 * a small, closely-related status type used across the marketplace.
 */
public final class Enums {

    private Enums() {}

    public enum AccountStatus {
        ACTIVE,
        INACTIVE
    }

    public enum ProductStatus {
        PUBLISHED,
        DRAFT,
        ARCHIVED
    }

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    public enum PaymentStatus {
        PENDING,
        PAID,
        REFUNDED
    }

    public enum DiscountType {
        PERCENTAGE,
        FIXED,
        FREE_SHIPPING
    }

    public enum CouponStatus {
        ACTIVE,
        EXPIRED
    }

    public enum BannerStatus {
        ACTIVE,
        INACTIVE
    }

    public enum ReviewStatus {
        PUBLISHED,
        PENDING
    }
}
