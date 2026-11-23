"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, SparklesIcon } from "lucide-react"

import { ApprovalTab } from "@/components/approval/approval-tab"
import { CatalogTab } from "@/components/catalog/catalog-tab"
import { Header } from "@/components/dashboard/header"
import { MODULES, type ModuleId } from "@/components/dashboard/modules"
import { TabBar } from "@/components/dashboard/tab-bar"
import { IntakeTab } from "@/components/intake/intake-tab"
import { MonitoringTab } from "@/components/monitoring/monitoring-tab"
import { PipelineTab } from "@/components/pipeline/pipeline-tab"
import { ReportsTab } from "@/components/reports/reports-tab"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { loadState, saveState } from "@/src/data/persistence"

const TAB_KEY = "branch-acquisition-portal:tabs"

interface TabState {
  openTabs: ModuleId[]
  activeTab: ModuleId | null
}

function loadTabs(): TabState {
  const stored = loadState<TabState | null>(null)
  if (stored && "openTabs" in (stored as object)) return stored as TabState
  if (typeof window === "undefined") return { openTabs: [], activeTab: null }
  try {
    const raw = window.localStorage.getItem(TAB_KEY)
    return raw ? (JSON.parse(raw) as TabState) : { openTabs: [], activeTab: null }
  } catch {
    return { openTabs: [], activeTab: null }
  }
}

export function DashboardShell() {
  const [tabs, setTabs] = useState<TabState>({ openTabs: [], activeTab: null })
  const [query, setQuery] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating persisted tabs from localStorage after mount
    setTabs(loadTabs())
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(TAB_KEY, JSON.stringify(tabs))
    } catch {
      saveState(tabs)
    }
  }, [tabs])

  function open(id: ModuleId) {
    setTabs((current) => ({
      openTabs: current.openTabs.includes(id) ? current.openTabs : [...current.openTabs, id],
      activeTab: id,
    }))
  }

  function close(id: ModuleId) {
    setTabs((current) => {
      const openTabs = current.openTabs.filter((tab) => tab !== id)
      return {
        openTabs,
        activeTab: current.activeTab === id ? (openTabs.at(-1) ?? null) : current.activeTab,
      }
    })
  }

  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return MODULES
    return MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term),
    )
  }, [query])

  const activeModule = useMemo(
    () => MODULES.find((m) => m.id === tabs.activeTab) ?? null,
    [tabs.activeTab],
  )

  const panel = {
    intake: <IntakeTab />,
    approval: <ApprovalTab />,
    pipeline: <PipelineTab />,
    monitoring: <MonitoringTab />,
    catalog: <CatalogTab onApply={() => open("intake")} />,
    reports: <ReportsTab />,
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xs tracking-tight">
              BM
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Bank Mandiri
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Acquisition Portal
              </p>
            </div>
          </div>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search modules..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 pl-8 pr-12 text-xs"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted/60 px-1 text-[10px] text-muted-foreground">
              ⌘K
            </span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
              Dashboards & Workflows
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredModules.map((module) => {
                  const isActive = tabs.activeTab === module.id
                  return (
                    <SidebarMenuItem key={module.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => open(module.id)}
                        className="group relative h-9 rounded-md px-2.5 font-medium transition-colors"
                      >
                        <module.icon className="size-4 shrink-0" />
                        <span className="truncate">{module.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
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
                In-memory store seeded with branches, staff, submissions, and merchants.
              </p>
            </CardContent>
          </Card>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-background">
        <Header />
        <div className="flex flex-col gap-5 p-5 lg:p-7">
          {activeModule ? (
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight">
                {activeModule.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeModule.description}
              </p>
            </div>
          ) : null}
          <TabBar
            openTabs={tabs.openTabs}
            activeTab={tabs.activeTab}
            onSelect={open}
            onClose={close}
          />
          {tabs.activeTab ? (
            panel[tabs.activeTab]
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <SparklesIcon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">No active module tab</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a module from the sidebar to open its workspace view.
                  </p>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button size="sm" onClick={() => open("intake")}>
                    Open Intake
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => open("monitoring")}>
                    Open Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
