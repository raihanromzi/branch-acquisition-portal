"use client"

import { useState } from "react"
import { RefreshCwIcon } from "lucide-react"

import { NbdsLog } from "@/components/approval/nbds-log"
import { StatusActions } from "@/components/approval/status-actions"
import { STATUS_LABEL } from "@/components/intake/status"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { syncRemoteSubmissions } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"
import type { AcquisitionStatus } from "@/src/types/entities"

export function ApprovalQueue() {
  const { submissions } = useStore()
  const [status, setStatus] = useState<AcquisitionStatus | "ALL">("ALL")
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    await syncRemoteSubmissions()
    setSyncing(false)
  }

  const rows = submissions.filter((item) => status === "ALL" || item.status === status)

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
          className="h-9 gap-1.5 rounded-lg text-xs"
        >
          <RefreshCwIcon className={`size-3.5 ${syncing ? "animate-spin" : ""}`} data-icon="inline-start" />
          <span>Sync Live Submissions</span>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>NBDS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.customerName}</TableCell>
              <TableCell className="tabular-nums">{row.nip}</TableCell>
              <TableCell>
                <NbdsLog result={row.nbdsResult} />
              </TableCell>
              <TableCell>
                <Badge variant="outline">{STATUS_LABEL[row.status]}</Badge>
              </TableCell>
              <TableCell>{row.note ?? "—"}</TableCell>
              <TableCell>
                <StatusActions submission={row} />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                Tidak ada pengajuan dalam status ini.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
