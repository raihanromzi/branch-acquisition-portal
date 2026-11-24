"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, SparklesIcon } from "lucide-react"

import { ApprovalTab } from "@/components/approval/approval-tab"
import { CatalogTab } from "@/components/catalog/catalog-tab"
import { Header } from "@/components/dashboard/header"
import { MODULES, type ModuleId } from "@/components/dashboard/modules"
import { OverviewTab } from "@/components/overview/overview-tab"
import { IntakeTab } from "@/components/intake/intake-tab"
import { MonitoringTab } from "@/components/monitoring/monitoring-tab"
import { PipelineTab } from "@/components/pipeline/pipeline-tab"
import { ReportsTab } from "@/components/reports/reports-tab"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { syncRemoteSubmissions } from "@/src/data/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    catalog: <CatalogTab onApply={() => setActiveModule("intake")} />,
    reports: <ReportsTab />,
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold tracking-tight text-primary-foreground">
              BM
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">Bank Mandiri</p>
              <p className="truncate text-xs text-muted-foreground">Acquisition Portal</p>
            </div>
          </div>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search modules..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Dashboards & Workflows
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredModules.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeModule === item.id}
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
        <SidebarFooter className="p-3">
          <Card className="rounded-lg border-border/60 bg-muted/30">
            <CardContent className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <SparklesIcon className="size-3.5 text-muted-foreground" />
                <span>Prototype Mode</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Local sample data for all branch workflows.
              </p>
            </CardContent>
          </Card>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-background">
        <Header breadcrumb={activeModuleMeta.label} />
        <main className="flex flex-col gap-5 p-5 lg:p-7">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {activeModuleMeta.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeModuleMeta.description}
            </p>
          </div>
          {panel[activeModule]}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
