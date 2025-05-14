"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function LandSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // Initialize form with URL search params
  useEffect(() => {
    const name = searchParams.get("name")
    if (name) {
      form.setValue("name", name)
    }
  }, [searchParams, form])

  const onSubmit = (values: FormValues) => {
    // Get current province from URL if it exists
    const province = searchParams.get("province")

    // Build new URL with search parameters
    const params = new URLSearchParams()
    if (province) params.set("province", province)
    if (values.name) params.set("name", values.name)

    // Navigate to the new URL
    router.push(`?${params.toString()}`)
  }

  const handleClear = () => {
    form.reset({ name: "" })

    // Get current province from URL if it exists
    const province = searchParams.get("province")

    // If province exists, keep it in the URL, otherwise clear all params
    if (province) {
      router.push(`?province=${province}`)
    } else {
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full space-x-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by land name..." className="pl-8" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
        {form.watch("name") && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </form>
    </Form>
  )
}
