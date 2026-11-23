"use client"

import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MODULES, type ModuleId } from "@/components/dashboard/modules"

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
      <TabsList>
        {openTabs.map((id) => {
          const tab = MODULES.find((item) => item.id === id)
          return (
            <TabsTrigger key={id} value={id}>
              {tab?.label}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Close ${tab?.label}`}
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
