package com.pajedhow.backend.repository;

import com.pajedhow.backend.entity.Order;
import com.pajedhow.backend.entity.enums.Enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("select coalesce(sum(o.total), 0) from Order o where o.status <> com.pajedhow.backend.entity.enums.Enums$OrderStatus.CANCELLED")
    BigDecimal totalRevenue();
}
