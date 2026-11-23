"use client"

import { DepositSimulator } from "@/components/catalog/deposit-simulator"
import { EdcFeeSimulator } from "@/components/catalog/edc-fee-simulator"
import { ProductCard } from "@/components/catalog/product-card"
import { getCatalog } from "@/src/data/store"
import type { ProductSegment } from "@/src/types/entities"

const SEGMENTS: { id: ProductSegment; label: string }[] = [
  { id: "RETAIL", label: "Retail" },
  { id: "BUSINESS_CURRENT", label: "Business / Current Account" },
  { id: "CORPORATE_PAYROLL", label: "Corporate Payroll" },
  { id: "PRIORITY_WEALTH", label: "Priority and Wealth" },
  { id: "MERCHANT_EDC", label: "Merchant & EDC" },
]

export function CatalogTab({ onApply }: { onApply: () => void }) {
  const { products } = getCatalog()
  return (
    <div className="flex flex-col gap-6">
      {SEGMENTS.map((segment) => (
        <section key={segment.id} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{segment.label}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {products.filter((product) => product.segment === segment.id).map((product) => (
              <ProductCard key={product.code} product={product} onApply={onApply} />
            ))}
          </div>
        </section>
      ))}
      <DepositSimulator />
      <EdcFeeSimulator />
    </div>
  )
}
