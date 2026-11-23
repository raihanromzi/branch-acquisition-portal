"use client"

import { CalendarDaysIcon, RotateCcwIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { reset } from "@/src/data/store"

export function Header() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-background px-5 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheckIcon aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Branch Operations</p>
          <p className="truncate text-xs text-muted-foreground">KC Jakarta Thamrin</p>
        </div>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Prototype v1.0
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden h-8 gap-1.5 px-2.5 sm:inline-flex">
          <CalendarDaysIcon aria-hidden="true" />
          23 Nov 2026
        </Badge>
        <Button type="button" size="sm" variant="outline" onClick={() => reset()}>
          <RotateCcwIcon data-icon="inline-start" />
          <span className="hidden sm:inline">Reset sample data</span>
          <span className="sm:hidden">Reset</span>
        </Button>
      </div>
    </header>
  )
}
