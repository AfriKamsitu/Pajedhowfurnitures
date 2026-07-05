package com.pajedhow.backend.service;

import com.pajedhow.backend.dto.SupplierDtos.SupplierRequest;
import com.pajedhow.backend.dto.SupplierDtos.SupplierResponse;
import com.pajedhow.backend.entity.Supplier;
import com.pajedhow.backend.exception.ResourceNotFoundException;
import com.pajedhow.backend.mapper.Mappers;
import com.pajedhow.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<SupplierResponse> findAll() {
        return supplierRepository.findAll().stream().map(Mappers::toSupplier).toList();
    }

    @Transactional(readOnly = true)
    public SupplierResponse findById(Long id) {
        return Mappers.toSupplier(get(id));
    }

    @Transactional
    public SupplierResponse create(SupplierRequest req) {
        Supplier s = Supplier.builder()
                .name(req.name())
                .location(req.location())
                .country(req.country())
                .rating(req.rating() != null ? req.rating() : 0.0)
                .responseTime(req.responseTime())
                .verified(Boolean.TRUE.equals(req.verified()))
                .build();
        return Mappers.toSupplier(supplierRepository.save(s));
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest req) {
        Supplier s = get(id);
        s.setName(req.name());
        s.setLocation(req.location());
        s.setCountry(req.country());
        if (req.rating() != null) s.setRating(req.rating());
        s.setResponseTime(req.responseTime());
        if (req.verified() != null) s.setVerified(req.verified());
        return Mappers.toSupplier(supplierRepository.save(s));
    }

    @Transactional
    public void delete(Long id) {
        Supplier s = get(id);
        supplierRepository.delete(s);
    }

    private Supplier get(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }
}
