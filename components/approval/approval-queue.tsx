"use client"

import { useMemo, useState } from "react"
import { type ColumnDef, useTable } from "@tanstack/react-table"
import { RefreshCwIcon } from "lucide-react"

import { NbdsLog } from "@/components/approval/nbds-log"
import { StatusActions } from "@/components/approval/status-actions"
import { STATUS_LABEL } from "@/components/intake/status"
import { Badge, type BadgeProps } from "@/components/reui/badge"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/reui/data-grid/data-grid"
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { syncRemoteSubmissions } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"
import type { AcquisitionStatus, AcquisitionSubmission } from "@/src/types/entities"

/** Status tokens from DESIGN.md: success, warning, danger. Text label always shown. */
const STATUS_BADGE: Record<AcquisitionStatus, BadgeProps["variant"]> = {
  WAITING_APPROVAL: "info-light",
  ACCEPTED_GMM: "success-light",
  REJECTED: "destructive-light",
  COMPLETED: "success-light",
}

const columns: ColumnDef<DataGridFeatures, AcquisitionSubmission>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <span className="font-medium">{row.original.customerName}</span>,
  },
  {
    accessorKey: "nip",
    header: "NIP",
    cell: ({ row }) => <span className="tabular-nums">{row.original.nip}</span>,
  },
  {
    accessorKey: "nbdsResult",
    header: "NBDS",
    cell: ({ row }) => <NbdsLog result={row.original.nbdsResult} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={STATUS_BADGE[row.original.status]}>{STATUS_LABEL[row.original.status]}</Badge>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => row.original.note ?? "—",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <StatusActions submission={row.original} />,
  },
]

export function ApprovalQueue() {
  const { submissions } = useStore()
  const [status, setStatus] = useState<AcquisitionStatus | "ALL">("ALL")
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    await syncRemoteSubmissions()
    setSyncing(false)
  }

  const rows = useMemo(
    () => submissions.filter((item) => status === "ALL" || item.status === status),
    [submissions, status],
  )

  const table = useTable({
    features: dataGridFeatures,
    data: rows,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-xs flex-1 flex-col gap-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as AcquisitionStatus | "ALL")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All statuses</SelectItem>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={syncing}
          onClick={handleSync}
        >
          <RefreshCwIcon className={syncing ? "animate-spin" : undefined} data-icon="inline-start" />
          Sync Live Submissions
        </Button>
      </div>

      <DataGrid
        table={table}
        recordCount={rows.length}
        emptyMessage="Tidak ada pengajuan dalam status ini."
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    </div>
  )
}
