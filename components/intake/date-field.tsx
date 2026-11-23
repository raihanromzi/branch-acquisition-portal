"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DateField({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="visitDate">Visit date</Label>
      <Input
        id="visitDate"
        type="date"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
