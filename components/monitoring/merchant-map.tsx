"use client"

import { useEffect, useState } from "react"
import { divIcon } from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import { isMerchantAlert } from "@/src/domain/merchant-alert"
import type { Merchant } from "@/src/types/entities"

function icon(alert: boolean) {
  return divIcon({
    className: "",
    html: `<span style="display:block;width:${alert ? 14 : 10}px;height:${alert ? 14 : 10}px;border-radius:50%;background:${alert ? "var(--danger)" : "var(--primary)"};border:2px solid #fff"></span>`,
    iconSize: [alert ? 14 : 10, alert ? 14 : 10],
    iconAnchor: [7, 7],
  })
}

function clusterIcon(count: number) {
  return divIcon({
    className: "",
    html: `<span style="display:flex;width:28px;height:28px;border-radius:50%;background:var(--primary);color:var(--primary-foreground);align-items:center;justify-content:center;font-size:12px">${count}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function cell(merchant: Merchant, zoom: number) {
  const scale = 2 ** Math.max(0, 12 - zoom)
  return `${Math.round(merchant.latitude / (0.01 * scale))}:${Math.round(merchant.longitude / (0.01 * scale))}`
}

function Markers({ merchants, onSelect }: { merchants: Merchant[]; onSelect: (merchant: Merchant) => void }) {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  useEffect(() => {
    const update = () => setZoom(map.getZoom())
    map.on("zoomend", update)
    return () => {
      map.off("zoomend", update)
    }
  }, [map])

  if (zoom >= 14) {
    return merchants.map((merchant) => (
      <Marker key={merchant.id} position={[merchant.latitude, merchant.longitude]} icon={icon(isMerchantAlert(merchant))} eventHandlers={{ click: () => onSelect(merchant) }} />
    ))
  }

  const groups = new Map<string, Merchant[]>()
  for (const merchant of merchants) {
    const key = cell(merchant, zoom)
    groups.set(key, [...(groups.get(key) ?? []), merchant])
  }
  return [...groups.entries()].map(([key, group]) => {
    const latitude = group.reduce((sum, item) => sum + item.latitude, 0) / group.length
    const longitude = group.reduce((sum, item) => sum + item.longitude, 0) / group.length
    if (group.length === 1) {
      const merchant = group[0]
      return <Marker key={merchant.id} position={[merchant.latitude, merchant.longitude]} icon={icon(isMerchantAlert(merchant))} eventHandlers={{ click: () => onSelect(merchant) }} />
    }
    return (
      <Marker
        key={key}
        position={[latitude, longitude]}
        icon={clusterIcon(group.length)}
        eventHandlers={{ click: () => map.setView([latitude, longitude], Math.min(zoom + 2, 16)) }}
      />
    )
  })
}

export function MerchantMap({
  merchants,
  onSelect,
}: {
  merchants: Merchant[]
  onSelect: (merchant: Merchant) => void
}) {
  if (merchants.length === 0) return <p className="text-sm">No merchants within this branch area.</p>
  const center = merchants[0]
  return (
    <MapContainer center={[center.latitude, center.longitude]} zoom={12} className="h-[420px] w-full">
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <Markers merchants={merchants} onSelect={onSelect} />
    </MapContainer>
  )
}
