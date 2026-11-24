"use client"

import { CalendarDaysIcon, RotateCcwIcon } from "lucide-react"

import { Badge } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { reset } from "@/src/data/store"

export function Header({ breadcrumb }: { breadcrumb: string }) {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-border bg-background px-5 lg:px-7">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <SidebarTrigger className="-ms-1.5" aria-label="Toggle sidebar" />
        <span className="truncate text-muted-foreground">Bank Mandiri</span>
        <span aria-hidden="true" className="text-muted-foreground">
          /
        </span>
        <span className="truncate font-medium" aria-current="page">
          {breadcrumb}
        </span>
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
