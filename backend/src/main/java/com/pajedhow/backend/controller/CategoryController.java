package com.pajedhow.backend.controller;

import com.pajedhow.backend.dto.CategoryDtos.CategoryResponse;
import com.pajedhow.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public category listing for the storefront navigation. */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.list();
    }

    @GetMapping("/{slug}")
    public CategoryResponse getBySlug(@PathVariable String slug) {
        return categoryService.findBySlug(slug);
    }
}
