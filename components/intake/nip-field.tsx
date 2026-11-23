"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCatalog, lookupStaff } from "@/src/data/store"

export function NipField({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const member = lookupStaff(value)
  const branch = getCatalog().branches.find((item) => item.id === member?.branchId)
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="nip">NIP</Label>
      <Input
        id="nip"
        inputMode="numeric"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 18))}
      />
      {member ? (
        <p className="text-sm text-muted-foreground">
          {member.name} · {branch?.name}. Name and branch are locked from the staff master.
        </p>
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
