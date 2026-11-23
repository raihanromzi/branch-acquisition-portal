"use client"

import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { reset } from "@/src/data/store"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div>
        <p className="text-sm text-muted-foreground">Bank Mandiri</p>
        <h1 className="text-lg font-semibold tracking-tight">Acquisition Portal</h1>
      </div>
      <Button type="button" variant="outline" onClick={() => reset()}>
        <RotateCcwIcon data-icon="inline-start" />
        Reset sample data
      </Button>
    </header>
  )
}
