"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PriceChartProps {
  prices: number[]
  startYear?: number
  lineColor?: string
}

export default function PriceChart({ prices, startYear = 2025, lineColor = "hsl(var(--primary))" }: PriceChartProps) {
  const [mounted, setMounted] = useState(false)

  // Create data array with years and prices
  const priceData = prices.map((price, index) => ({
    year: (startYear + index).toString(),
    price,
  }))

  // Calculate min and max for y-axis domain with some padding
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const yAxisMin = Math.floor(minPrice * 0.95)
  const yAxisMax = Math.ceil(maxPrice * 1.05)

  // Format price for display
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="w-full h-[400px] mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Price Forecast ({startYear}-{startYear + prices.length - 1})
      </h3>

      <div className="w-full h-[300px]">
        {/* ChartContainer is required for shadcn/ui chart components */}
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: lineColor,
            },
          }}
          className="h-full"
        >
          <LineChart
            data={priceData}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
              domain={[yAxisMin, yAxisMax]}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(Number(value))} />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "white",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
