package com.pajedhow.backend.service;

import com.pajedhow.backend.dto.MarketingDtos.CouponRequest;
import com.pajedhow.backend.dto.MarketingDtos.CouponResponse;
import com.pajedhow.backend.entity.Coupon;
import com.pajedhow.backend.entity.enums.Enums.CouponStatus;
import com.pajedhow.backend.entity.enums.Enums.DiscountType;
import com.pajedhow.backend.exception.BadRequestException;
import com.pajedhow.backend.exception.ResourceNotFoundException;
import com.pajedhow.backend.mapper.Mappers;
import com.pajedhow.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<CouponResponse> findAll() {
        return couponRepository.findAll().stream().map(Mappers::toCoupon).toList();
    }

    /** Validate a coupon code for checkout. Throws when unusable. */
    @Transactional(readOnly = true)
    public CouponResponse validate(String code) {
        Coupon c = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + code));
        if (c.getStatus() != CouponStatus.ACTIVE) {
            throw new BadRequestException("Coupon is not active");
        }
        if (c.getValidUntil() != null && c.getValidUntil().isBefore(LocalDate.now())) {
            throw new BadRequestException("Coupon has expired");
        }
        if (c.getUsageLimit() > 0 && c.getUsageCount() >= c.getUsageLimit()) {
            throw new BadRequestException("Coupon usage limit reached");
        }
        return Mappers.toCoupon(c);
    }

    @Transactional
    public CouponResponse create(CouponRequest req) {
        couponRepository.findByCodeIgnoreCase(req.code()).ifPresent(existing -> {
            throw new BadRequestException("Coupon code already exists");
        });
        Coupon c = Coupon.builder()
                .code(req.code().toUpperCase())
                .discountType(parseType(req.discountType()))
                .discountValue(req.discountValue() != null ? req.discountValue() : BigDecimal.ZERO)
                .usageLimit(req.usageLimit() != null ? req.usageLimit() : 0)
                .usageCount(0)
                .validUntil(req.validUntil())
                .status(parseStatus(req.status()))
                .build();
        return Mappers.toCoupon(couponRepository.save(c));
    }

    @Transactional
    public CouponResponse update(Long id, CouponRequest req) {
        Coupon c = get(id);
        c.setCode(req.code().toUpperCase());
        c.setDiscountType(parseType(req.discountType()));
        if (req.discountValue() != null) c.setDiscountValue(req.discountValue());
        if (req.usageLimit() != null) c.setUsageLimit(req.usageLimit());
        c.setValidUntil(req.validUntil());
        c.setStatus(parseStatus(req.status()));
        return Mappers.toCoupon(couponRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        couponRepository.delete(get(id));
    }

    private Coupon get(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + id));
    }

    private DiscountType parseType(String value) {
        try {
            return DiscountType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException("Invalid discount type: " + value);
        }
    }

    private CouponStatus parseStatus(String value) {
        if (value == null || value.isBlank()) return CouponStatus.ACTIVE;
        try {
            return CouponStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid coupon status: " + value);
        }
    }
}
