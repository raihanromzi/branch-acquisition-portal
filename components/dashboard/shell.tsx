"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { ApprovalTab } from "@/components/approval/approval-tab"
import { Header } from "@/components/dashboard/header"
import { MODULES, type ModuleId } from "@/components/dashboard/modules"
import { OverviewTab } from "@/components/overview/overview-tab"
import { IntakeTab } from "@/components/intake/intake-tab"
import { MonitoringTab } from "@/components/monitoring/monitoring-tab"
import { PipelineTab } from "@/components/pipeline/pipeline-tab"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { syncRemoteSubmissions } from "@/src/data/store"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function DashboardShell() {
  const [activeModule, setActiveModule] = useState<ModuleId>("overview")
  const [query, setQuery] = useState("")

  useEffect(() => {
    void syncRemoteSubmissions()
    const timer = setInterval(() => {
      void syncRemoteSubmissions()
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return MODULES
    return MODULES.filter(
      (module) =>
        module.label.toLowerCase().includes(term) ||
        module.description.toLowerCase().includes(term),
    )
  }, [query])

  const activeModuleMeta =
    MODULES.find((item) => item.id === activeModule) ?? MODULES[0]
  const panel = {
    overview: <OverviewTab />,
    intake: <IntakeTab />,
    approval: <ApprovalTab />,
    pipeline: <PipelineTab />,
    monitoring: <MonitoringTab />,
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-semibold tracking-tight text-sidebar-primary-foreground">
                BM
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold tracking-tight">
                  Bank Mandiri
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  Acquisition Portal
                </p>
              </div>
            </div>
            <div className="relative group-data-[collapsible=icon]:hidden">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
              <Input
                type="search"
                placeholder="Search modules..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-8 border-sidebar-border bg-sidebar-accent pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredModules.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeModule === item.id}
                        tooltip={item.label}
                        onClick={() => setActiveModule(item.id)}
                        className="h-9 rounded-md px-2.5 font-medium"
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {filteredModules.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      No modules match &ldquo;{query}&rdquo;
                    </p>
                  ) : null}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-w-0 overflow-hidden bg-background">
          <Header breadcrumb={activeModuleMeta.label} />
          <main className="flex flex-col gap-4 p-5 lg:p-7">{panel[activeModule]}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
