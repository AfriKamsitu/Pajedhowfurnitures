package com.pajedhow.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {}

    public record StatCard(String label, String value, String icon) {}

    public record NameValue(String name, long value) {}

    public record TopProduct(String name, BigDecimal price, String image) {}

    public record ActivityEntry(Long id, String actor, String action, String target, String time) {}

    public record DashboardResponse(
            BigDecimal totalRevenue,
            long totalOrders,
            long totalCustomers,
            long totalProducts,
            List<StatCard> stats,
            List<NameValue> orderStatusBreakdown,
            List<TopProduct> topSelling,
            List<ActivityEntry> recentActivity
    ) {}
}
