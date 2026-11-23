"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatRupiah } from "@/src/domain/currency"
import type { Merchant } from "@/src/types/entities"

export function MerchantDrawer({
  merchant,
  onClose,
  onScheduleVisit,
}: {
  merchant: Merchant | null
  onClose: () => void
  onScheduleVisit: (merchant: Merchant) => void
}) {
  return (
    <Sheet open={merchant !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent>
        {merchant ? (
          <div className="flex flex-col gap-4">
            <SheetHeader>
              <SheetTitle>{merchant.storeName}</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex flex-col gap-2 text-sm">
              <p>Owner: {merchant.owner}</p>
              <p className="tabular-nums">CIF: {merchant.cif}</p>
              <p className="tabular-nums">Monthly sales: {formatRupiah(merchant.monthlySales)}</p>
              <p className="tabular-nums">MDR: {merchant.mdrPercent}%</p>
              <p>EDC status: {merchant.edcStatus}</p>
            </div>
            <Button type="button" onClick={() => onScheduleVisit(merchant)}>Schedule Visit</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
