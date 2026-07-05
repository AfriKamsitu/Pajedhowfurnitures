package com.pajedhow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

public final class ProductDtos {

    private ProductDtos() {}

    public record ProductResponse(
            Long id,
            String slug,
            String name,
            String category,
            BigDecimal price,
            BigDecimal oldPrice,
            String image,
            Double rating,
            Integer reviews,
            boolean isNew,
            List<String> colors,
            String material,
            String status,
            Integer stock,
            boolean inStock,
            String sku,
            Integer moq,
            Integer warrantyMonths,
            Integer deliveryDays,
            SupplierDtos.SupplierResponse supplier
    ) {}

    public record ProductRequest(
            @NotBlank String name,
            String slug,
            @NotBlank String category,
            @NotNull @PositiveOrZero BigDecimal price,
            BigDecimal oldPrice,
            String image,
            Boolean isNew,
            List<String> colors,
            String material,
            String status,          // PUBLISHED | DRAFT | ARCHIVED
            @PositiveOrZero Integer stock,
            String sku,
            Integer moq,
            Integer warrantyMonths,
            Integer deliveryDays,
            Long supplierId
    ) {}
}
