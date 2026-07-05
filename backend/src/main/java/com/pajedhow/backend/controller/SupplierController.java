package com.pajedhow.backend.controller;

import com.pajedhow.backend.dto.SupplierDtos.SupplierResponse;
import com.pajedhow.backend.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public supplier directory used on product pages. */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<SupplierResponse> list() {
        return supplierService.findAll();
    }

    @GetMapping("/{id}")
    public SupplierResponse getById(@PathVariable Long id) {
        return supplierService.findById(id);
    }
}
