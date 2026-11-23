"use client"

import { Button } from "@/components/ui/button"
import { getCatalog, getState } from "@/src/data/store"
import { buildWorkbook, downloadWorkbook } from "@/src/exports/excel"

export function ExportActions() {
  return (
    <div className="no-print flex gap-2">
      <Button type="button" variant="outline" onClick={() => window.print()}>Print summary</Button>
      <Button
        type="button"
        onClick={() => {
          const catalog = getCatalog()
          downloadWorkbook(buildWorkbook({ ...catalog, pipeline: getState().pipeline }))
        }}
      >
        Export workbook
      </Button>
    </div>
  )
}
