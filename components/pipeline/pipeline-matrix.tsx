"use client"

import { Fragment, useState } from "react"

import { EntryDetail } from "@/components/pipeline/entry-detail"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCatalog } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"

export function PipelineMatrix() {
  const { pipeline } = useStore()
  const { branches, staff } = getCatalog()
  const [branchId, setBranchId] = useState("ALL")
  const [picNip, setPicNip] = useState("ALL")
  const [openId, setOpenId] = useState<string | null>(null)
  const rows = pipeline.filter((entry) =>
    (branchId === "ALL" || entry.branchId === branchId) &&
    (picNip === "ALL" || entry.picNip === picNip),
  )
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Branch</Label>
          <Select value={branchId} onValueChange={setBranchId}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup><SelectItem value="ALL">All branches</SelectItem>{branches.map((branch) => <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>PIC</Label>
          <Select value={picNip} onValueChange={setPicNip}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup><SelectItem value="ALL">All PIC</SelectItem>{staff.map((member) => <SelectItem key={member.nip} value={member.nip}>{member.name}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Branch</TableHead><TableHead>Stage</TableHead><TableHead>Visit</TableHead></TableRow></TableHeader>
        <TableBody>
          {rows.map((entry) => (
            <Fragment key={entry.id}>
              <TableRow onClick={() => setOpenId(openId === entry.id ? null : entry.id)}>
                <TableCell>{entry.customerName}</TableCell>
                <TableCell>{branches.find((branch) => branch.id === entry.branchId)?.name}</TableCell>
                <TableCell><Badge variant="outline">{entry.stage}</Badge></TableCell>
                <TableCell>{entry.visitStatus}</TableCell>
              </TableRow>
              {openId === entry.id ? <TableRow><TableCell colSpan={4}><EntryDetail entry={entry} /></TableCell></TableRow> : null}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
