"use client"

import { useState } from "react"

import { KpiCards } from "@/components/monitoring/kpi-cards"
import { MerchantDrawer } from "@/components/monitoring/merchant-drawer"
import { MerchantMapLazy } from "@/components/monitoring/merchant-map-lazy"
import { RoutePanel } from "@/components/monitoring/route-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCatalog } from "@/src/data/store"
import type { Merchant } from "@/src/types/entities"

export function MonitoringTab() {
  const { branches, kpi, merchants } = getCatalog()
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "")
  const [selected, setSelected] = useState<Merchant | null>(null)
  const branch = branches.find((item) => item.id === branchId) ?? branches[0]
  const branchKpi = kpi.find((row) => row.branchId === branch?.id)
  const branchMerchants = merchants.filter((merchant) => merchant.branchId === branch?.id)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-xs flex-col gap-2">
        <Label>Branch</Label>
        <Select value={branchId} onValueChange={setBranchId}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{branches.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </div>
      {branchKpi ? <KpiCards kpi={branchKpi} /> : null}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Merchant map</CardTitle></CardHeader>
          <CardContent>
            <MerchantMapLazy merchants={branchMerchants} onSelect={setSelected} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Visit route</CardTitle></CardHeader>
            <CardContent>{branch ? <RoutePanel branch={branch} merchants={branchMerchants} /> : null}</CardContent>
          </Card>
        </div>
      </div>
      <MerchantDrawer
        merchant={selected}
        onClose={() => setSelected(null)}
        onScheduleVisit={(merchant) => {
          setSelected(null)
          window.alert(`Visit scheduled for ${merchant.storeName}.`)
        }}
      />
    </div>
  )
}
