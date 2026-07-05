package com.pajedhow.backend.service;

import com.pajedhow.backend.dto.OrderDtos.*;
import com.pajedhow.backend.entity.*;
import com.pajedhow.backend.entity.enums.Enums.OrderStatus;
import com.pajedhow.backend.entity.enums.Enums.PaymentStatus;
import com.pajedhow.backend.exception.BadRequestException;
import com.pajedhow.backend.exception.ResourceNotFoundException;
import com.pajedhow.backend.mapper.Mappers;
import com.pajedhow.backend.repository.OrderRepository;
import com.pajedhow.backend.repository.ProductRepository;
import com.pajedhow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLog;

    @Transactional(readOnly = true)
    public Page<OrderResponse> findAll(String status, Pageable pageable) {
        Page<Order> page = (status == null || status.isBlank())
                ? orderRepository.findAll(pageable)
                : orderRepository.findByStatus(parseStatus(status), pageable);
        return page.map(Mappers::toOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return Mappers.toOrder(get(id));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByCustomer(String customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream().map(Mappers::toOrder).toList();
    }

    /** Create an order from a checkout payload. customerId may be null for guest/admin orders. */
    @Transactional
    public OrderResponse create(CreateOrderRequest req, String customerId) {
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .payment(req.payment() != null ? req.payment() : "Cash on Delivery")
                .phone(req.phone())
                .shippingAddress(req.shippingAddress())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        if (customerId != null) {
            User customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));
            order.setCustomer(customer);
            order.setCustomerName(req.customerName() != null ? req.customerName() : customer.getName());
            if (order.getPhone() == null) order.setPhone(customer.getPhone());
        } else {
            if (req.customerName() == null || req.customerName().isBlank()) {
                throw new BadRequestException("customerName is required for guest orders");
            }
            order.setCustomerName(req.customerName());
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : req.items()) {
            OrderItem item = OrderItem.builder()
                    .productId(itemReq.productId())
                    .name(itemReq.name())
                    .image(itemReq.image())
                    .price(itemReq.price())
                    .quantity(itemReq.quantity())
                    .build();
            order.addItem(item);
            subtotal = subtotal.add(itemReq.price().multiply(BigDecimal.valueOf(itemReq.quantity())));

            // decrement stock when the item maps to a catalog product
            if (itemReq.productId() != null) {
                productRepository.findById(itemReq.productId()).ifPresent(p -> {
                    int remaining = Math.max(0, p.getStock() - itemReq.quantity());
                    p.setStock(remaining);
                    productRepository.save(p);
                });
            }
        }

        BigDecimal delivery = req.delivery() != null ? req.delivery() : BigDecimal.ZERO;
        order.setSubtotal(subtotal);
        order.setDelivery(delivery);
        order.setTotal(subtotal.add(delivery));
        order.addEvent(OrderEvent.builder().label("Order placed").done(true).build());

        Order saved = orderRepository.save(order);
        activityLog.record(order.getCustomerName(), "placed order", saved.getOrderNumber());
        return Mappers.toOrder(saved);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, UpdateStatusRequest req) {
        Order order = get(id);
        OrderStatus next = parseStatus(req.status());
        order.setStatus(next);

        // reflect the transition on the timeline + payment
        String label = switch (next) {
            case PENDING -> "Order placed";
            case PROCESSING -> "Processing";
            case SHIPPED -> "Shipped";
            case DELIVERED -> "Delivered";
            case CANCELLED -> "Cancelled";
        };
        boolean exists = order.getTimeline().stream().anyMatch(e -> e.getLabel().equals(label));
        if (!exists) {
            order.addEvent(OrderEvent.builder().label(label).done(true).build());
        }
        if (next == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        Order saved = orderRepository.save(order);
        activityLog.record("Admin", "updated order status to " + next, saved.getOrderNumber());
        return Mappers.toOrder(saved);
    }

    @Transactional
    public void delete(Long id) {
        Order order = get(id);
        orderRepository.delete(order);
        activityLog.record("Admin", "deleted order", order.getOrderNumber());
    }

    private Order get(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    private OrderStatus parseStatus(String value) {
        try {
            return OrderStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid order status: " + value);
        }
    }

    private String generateOrderNumber() {
        String candidate;
        do {
            candidate = "#FH" + ThreadLocalRandom.current().nextInt(10000, 99999);
        } while (orderRepository.findByOrderNumber(candidate).isPresent());
        return candidate;
    }
}
