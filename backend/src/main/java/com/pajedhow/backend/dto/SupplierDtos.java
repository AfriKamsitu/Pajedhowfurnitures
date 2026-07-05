package com.pajedhow.backend.dto;

import jakarta.validation.constraints.NotBlank;

public final class SupplierDtos {

    private SupplierDtos() {}

    public record SupplierResponse(
            Long id,
            String name,
            String location,
            String country,
            Double rating,
            String responseTime,
            boolean verified
    ) {}

    public record SupplierRequest(
            @NotBlank String name,
            String location,
            String country,
            Double rating,
            String responseTime,
            Boolean verified
    ) {}
}
