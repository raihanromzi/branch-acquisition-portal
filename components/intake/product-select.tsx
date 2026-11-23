"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCatalog } from "@/src/data/store"
import type { AcquisitionType } from "@/src/types/entities"

export function ProductSelect({
  type,
  value,
  onChange,
  error,
}: {
  type: AcquisitionType
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const options = getCatalog().products.filter((product) => product.acquisitionType === type)
  return (
    <div className="flex flex-col gap-2">
      <Label>Product code</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" aria-invalid={Boolean(error)}>
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((product) => (
              <SelectItem key={product.code} value={product.code}>
                {product.code} · {product.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
