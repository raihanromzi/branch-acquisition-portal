"use client"

import dynamic from "next/dynamic"

import type { Merchant } from "@/src/types/entities"

// Leaflet must render client-side only (plan constraint, T061).
const MerchantMap = dynamic(
  () => import("./merchant-map").then((module) => module.MerchantMap),
  { ssr: false },
)

export function MerchantMapLazy(props: { merchants: Merchant[]; onSelect: (merchant: Merchant) => void }) {
  return <MerchantMap {...props} />
}
