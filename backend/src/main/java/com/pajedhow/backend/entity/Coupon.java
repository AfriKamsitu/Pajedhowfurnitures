package com.pajedhow.backend.entity;

import com.pajedhow.backend.entity.enums.Enums.CouponStatus;
import com.pajedhow.backend.entity.enums.Enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "coupons", indexes = {
        @Index(name = "idx_coupons_code", columnList = "code", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private DiscountType discountType;

    /** Percentage (0-100) or fixed TZS amount; ignored for FREE_SHIPPING. */
    @Column(precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal discountValue = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer usageLimit = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer usageCount = 0;

    private LocalDate validUntil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    @Builder.Default
    private CouponStatus status = CouponStatus.ACTIVE;
}
