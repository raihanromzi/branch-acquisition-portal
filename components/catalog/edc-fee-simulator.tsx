"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatRupiah } from "@/src/domain/currency"
import { compareEdcFeeSchemes } from "@/src/domain/simulators"

export function EdcFeeSimulator() {
  const [sales, setSales] = useState(20_000_000)
  const comparison = compareEdcFeeSchemes(sales, { name: "Current", mdrPercent: 0.9 }, { name: "Proposed", mdrPercent: 0.7 })
  return (
    <Card>
      <CardHeader><CardTitle>EDC fee simulator</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2"><Label htmlFor="edc-sales">Monthly sales</Label><Input id="edc-sales" type="number" className="text-right tabular-nums" value={sales} onChange={(event) => setSales(Number(event.target.value))} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-right text-sm tabular-nums">Current 0.9%: {formatRupiah(comparison.currentAnnual)}</p>
          <p className="text-right text-sm tabular-nums">Proposed 0.7%: {formatRupiah(comparison.proposedAnnual)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
