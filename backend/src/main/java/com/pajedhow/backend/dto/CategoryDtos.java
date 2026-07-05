package com.pajedhow.backend.dto;

import jakarta.validation.constraints.NotBlank;

public final class CategoryDtos {

    private CategoryDtos() {}

    public record CategoryResponse(
            Long id,
            String slug,
            String name,
            String description,
            String image,
            String status,
            long productCount
    ) {}

    public record CategoryRequest(
            @NotBlank String name,
            String slug,
            String description,
            String image,
            String status
    ) {}
}
