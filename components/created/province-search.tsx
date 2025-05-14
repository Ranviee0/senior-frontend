"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import provinces from "@/data/provinces.json"

export function ProvinceSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Initialize the value from URL search params
  useEffect(() => {
    const province = searchParams.get("province")
    if (province) {
      setValue(province)
    }
  }, [searchParams])

  // Filter provinces based on search term
  const filteredProvinces = provinces.filter(
    (province) =>
      province["name-en"].toLowerCase().includes(searchTerm.toLowerCase()) || province["name-th"].includes(searchTerm),
  )

  const handleSelect = (currentValue: string) => {
    // If clicking the same value, clear the selection
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    setOpen(false)

    // Update URL with the selected province or remove the parameter if cleared
    if (newValue) {
      router.push(`?province=${encodeURIComponent(newValue)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between md:w-[250px]">
          {value ? provinces.find((province) => province["name-en"] === value)?.["name-en"] : "Select province..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[250px]">
        <Command>
          <CommandInput placeholder="Search province..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>No province found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {filteredProvinces.map((province) => (
                <CommandItem key={province["name-en"]} value={province["name-en"]} onSelect={handleSelect}>
                  <Check className={cn("mr-2 h-4 w-4", value === province["name-en"] ? "opacity-100" : "opacity-0")} />
                  <span>{province["name-en"]}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{province["name-th"]}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
