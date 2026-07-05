package com.pajedhow.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OrderDtos {

    private OrderDtos() {}

    public record OrderItemResponse(
            Long id,
            Long productId,
            String name,
            String image,
            BigDecimal price,
            Integer quantity
    ) {}

    public record OrderEventResponse(
            Long id,
            String label,
            boolean done,
            Instant at
    ) {}

    public record OrderResponse(
            Long id,
            String orderNumber,
            String customerId,
            String customerName,
            String phone,
            String shippingAddress,
            String status,
            String payment,
            String paymentStatus,
            BigDecimal subtotal,
            BigDecimal delivery,
            BigDecimal total,
            List<OrderItemResponse> items,
            List<OrderEventResponse> timeline,
            Instant createdAt,
            Instant updatedAt
    ) {}

    public record OrderItemRequest(
            Long productId,
            @NotBlank String name,
            String image,
            @NotNull BigDecimal price,
            @NotNull @Positive Integer quantity
    ) {}

    /** Checkout payload sent by a customer or created by an admin. */
    public record CreateOrderRequest(
            String customerName,
            String phone,
            String shippingAddress,
            String payment,
            BigDecimal delivery,
            @NotEmpty @Valid List<OrderItemRequest> items
    ) {}

    public record UpdateStatusRequest(
            @NotBlank String status  // PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
    ) {}
}
