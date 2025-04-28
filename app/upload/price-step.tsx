"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import PriceChart from "./price-chart"
import { useState, useEffect } from "react"
import { MapPin, Ruler } from "lucide-react"

export function PriceStep() {
  const { control, watch } = useFormContext()
  const [forecastPrices, setForecastPrices] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Watch the form values we need
  const latitude = watch("latitude")
  const longitude = watch("longitude")
  const area = watch("area")
  const price = watch("price") || 0

  // Fetch forecast prices from API based on location and area
  useEffect(() => {
    const fetchForecastPrices = async () => {
      // Only fetch if we have valid values
      if (!latitude || !longitude || !area || area <= 0) {
        setForecastPrices([])
        return
      }

      setIsLoading(true)
      setFetchError(null)

      try {
        const url = `http://localhost:8000/predict/predict-multi/?latitude=${latitude}&longitude=${longitude}&land_size=${area}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setForecastPrices(data)
      } catch (error) {
        console.error("Error fetching price forecast:", error)
        setFetchError(error instanceof Error ? error.message : "Failed to fetch price forecast")
        setForecastPrices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecastPrices()
  }, [latitude, longitude, area])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Price Information</h2>
        <p className="text-sm text-muted-foreground mb-4">Set the price for your land and view the price forecast</p>
      </div>

      {/* Display the location and area information */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>Area: {area} sq.m.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price input field */}
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (THB)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter price in THB"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price per square meter calculation */}
      {price > 0 && area > 0 && (
        <div className="text-sm">
          <span className="font-medium">Price per sq.m.:</span>{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "THB",
            minimumFractionDigits: 0,
          }).format(price / area)}
        </div>
      )}

      {/* Show loading state or error */}
      {isLoading && <div className="py-4 text-center text-muted-foreground">Loading price forecast...</div>}

      {fetchError && <div className="py-4 text-center text-destructive text-sm">Error: {fetchError}</div>}

      {/* Price forecast chart */}
      {!isLoading && forecastPrices.length > 0 && <PriceChart prices={forecastPrices} />}
    </div>
  )
}
