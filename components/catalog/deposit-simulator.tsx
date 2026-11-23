"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { estimateDepositReturn } from "@/src/domain/simulators"
import { formatRupiah } from "@/src/domain/currency"

export function DepositSimulator() {
  const [amount, setAmount] = useState(10_000_000)
  const [tenor, setTenor] = useState(12)
  const estimate = estimateDepositReturn(amount, tenor, 5)
  return (
    <Card>
      <CardHeader><CardTitle>Deposit simulator</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2"><Label htmlFor="deposit-amount">Amount</Label><Input id="deposit-amount" type="number" className="text-right tabular-nums" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></div>
        <div className="flex flex-col gap-2"><Label htmlFor="deposit-tenor">Tenor (months)</Label><Input id="deposit-tenor" type="number" className="text-right tabular-nums" value={tenor} onChange={(event) => setTenor(Number(event.target.value))} /></div>
        <p className="text-right text-sm tabular-nums md:col-span-2">Estimated return: {formatRupiah(estimate)}</p>
      </CardContent>
    </Card>
  )
}
