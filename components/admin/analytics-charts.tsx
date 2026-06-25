"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 18_000_000, orders: 240 },
  { month: "Feb", revenue: 21_000_000, orders: 280 },
  { month: "Mar", revenue: 19_500_000, orders: 260 },
  { month: "Apr", revenue: 24_000_000, orders: 310 },
  { month: "May", revenue: 28_450_000, orders: 348 },
  { month: "Jun", revenue: 26_000_000, orders: 320 },
]

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const ordersConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

export function RevenueBarChart() {
  return (
    <ChartContainer config={revenueConfig} className="h-[280px] w-full">
      <BarChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={42} fontSize={11} tickFormatter={(v) => `${v / 1_000_000}M`} />
        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

export function OrdersLineChart() {
  return (
    <ChartContainer config={ordersConfig} className="h-[280px] w-full">
      <LineChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={36} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="orders" type="monotone" stroke="var(--color-orders)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  )
}
