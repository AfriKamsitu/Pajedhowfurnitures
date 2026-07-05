package com.pajedhow.backend.dto;

import jakarta.validation.constraints.NotBlank;

public final class AddressDtos {

    private AddressDtos() {}

    public record AddressResponse(
            Long id,
            String label,
            String fullName,
            String phone,
            String street,
            String city,
            String region,
            boolean isDefault
    ) {}

    public record AddressRequest(
            String label,
            @NotBlank String fullName,
            @NotBlank String phone,
            @NotBlank String street,
            @NotBlank String city,
            String region,
            boolean isDefault
    ) {}
}
