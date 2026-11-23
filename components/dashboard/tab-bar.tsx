"use client"

import { XIcon } from "lucide-react"

import { MODULES, type ModuleId } from "@/components/dashboard/modules"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function TabBar({
  openTabs,
  activeTab,
  onSelect,
  onClose,
}: {
  openTabs: ModuleId[]
  activeTab: ModuleId | null
  onSelect: (id: ModuleId) => void
  onClose: (id: ModuleId) => void
}) {
  if (!activeTab) return null

  return (
    <Tabs value={activeTab} onValueChange={(value) => onSelect(value as ModuleId)}>
      <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-1">
        {openTabs.map((id) => {
          const tab = MODULES.find((item) => item.id === id)
          return (
            <TabsTrigger
              key={id}
              value={id}
              className={cn(
                "group h-8 shrink-0 gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              )}
            >
              {tab?.label}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Close ${tab?.label}`}
                className="size-4 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={(event) => {
                  event.stopPropagation()
                  onClose(id)
                }}
              >
                <XIcon />
              </Button>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
