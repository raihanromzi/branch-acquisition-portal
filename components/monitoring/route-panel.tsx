"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { planVisitRoute } from "@/src/domain/route"
import { isMerchantAlert } from "@/src/domain/merchant-alert"
import type { Branch, Merchant } from "@/src/types/entities"

export function RoutePanel({ branch, merchants }: { branch: Branch; merchants: Merchant[] }) {
  const [route, setRoute] = useState<{ stops: Merchant[]; totalKm: number } | null>(null)
  const alerts = useMemo(() => merchants.filter(isMerchantAlert), [merchants])
  const disabled = alerts.length === 0
  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        disabled={disabled}
        onClick={() => setRoute(planVisitRoute({ latitude: branch.latitude, longitude: branch.longitude }, alerts))}
      >
        Plan visit route
      </Button>
      {disabled ? <p className="text-sm text-muted-foreground">No alert merchants in range.</p> : null}
      {route ? (
        <>
          <ol className="flex flex-col gap-1 text-sm">
            {route.stops.map((stop, index) => (
              <li key={stop.id} className="tabular-nums">{index + 1}. {stop.storeName}</li>
            ))}
          </ol>
          <p className="text-sm tabular-nums">Total: {route.totalKm.toFixed(1)} km</p>
        </>
      ) : null}
    </div>
  )
}
