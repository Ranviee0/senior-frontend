import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import type { LandListing } from "@/types/data"

interface LandListingCardProps {
  listing: LandListing
}

export function LandListingCard({ listing }: LandListingCardProps) {
  const { id, landName, description, price, address, images } = listing

  return (
    <Link href={`/lands/${id}`} className="block h-full">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer">
        <div className="relative h-40 w-full">
          <Image
            src={images[0]}
            alt={landName}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardHeader className="py-3 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold line-clamp-1">{landName}</h2>
            <p className="text-green-600 font-semibold">{formatPrice(price)}</p>
          </div>
        </CardHeader>
        <CardContent className="py-0 px-4 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="border-t py-3 px-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Address:</span> {address}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}
