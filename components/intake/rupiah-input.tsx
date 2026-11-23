"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatRupiah, parseRupiah } from "@/src/domain/currency"

export function RupiahInput({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
}) {
  const [text, setText] = useState(value === undefined ? "" : formatRupiah(value))
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        className="text-right tabular-nums"
        value={text}
        aria-invalid={Boolean(error)}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          const parsed = parseRupiah(text)
          if (parsed === null) {
            onChange(undefined)
            return
          }
          onChange(parsed)
          setText(formatRupiah(parsed))
        }}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
