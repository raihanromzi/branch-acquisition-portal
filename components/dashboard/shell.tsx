"use client"

import { useEffect, useState } from "react"

import { ApprovalTab } from "@/components/approval/approval-tab"
import { CatalogTab } from "@/components/catalog/catalog-tab"
import { Header } from "@/components/dashboard/header"
import { MODULES, type ModuleId } from "@/components/dashboard/modules"
import { TabBar } from "@/components/dashboard/tab-bar"
import { IntakeTab } from "@/components/intake/intake-tab"
import { MonitoringTab } from "@/components/monitoring/monitoring-tab"
import { PipelineTab } from "@/components/pipeline/pipeline-tab"
import { ReportsTab } from "@/components/reports/reports-tab"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
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
  // Start empty on both server and client to keep hydration stable, then
  // mirror the persisted tabs from localStorage after mount.
  const [tabs, setTabs] = useState<TabState>({ openTabs: [], activeTab: null })

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
      <Sidebar>
        <SidebarHeader>
          <p className="px-2 text-sm font-semibold">Modules</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {MODULES.map((module) => (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton isActive={tabs.activeTab === module.id} onClick={() => open(module.id)}>
                      <module.icon />
                      <span>{module.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex flex-col gap-4 p-4">
          <TabBar openTabs={tabs.openTabs} activeTab={tabs.activeTab} onSelect={open} onClose={close} />
          {tabs.activeTab ? (
            panel[tabs.activeTab]
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Open a module from the sidebar. Open tabs stay after reload.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </SidebarProvider>
  )
}
