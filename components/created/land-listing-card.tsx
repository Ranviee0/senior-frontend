import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface LandListing {
  id: number
  landName: string
  description: string
  price: number
  address: string
  images: string[]
}

interface LandListingCardProps {
  listing: LandListing
}

export function LandListingCard({ listing }: LandListingCardProps) {
  const { landName, description, price, address, images } = listing
  console.log(images)

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={images[0]}
          alt={landName}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <h2 className="text-xl font-bold">{landName}</h2>
        <p className="text-green-600 font-semibold text-lg">{formatPrice(price)}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Address:</span> {address}
        </p>
      </CardFooter>
    </Card>
  )
}
