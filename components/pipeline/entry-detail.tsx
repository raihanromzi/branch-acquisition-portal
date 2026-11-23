"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addChecklistDone, addVisitRecord, advancePipelineStage } from "@/src/data/store"
import type { BranchPipelineEntry } from "@/src/types/entities"

export function EntryDetail({ entry }: { entry: BranchPipelineEntry }) {
  const [note, setNote] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  return (
    <div className="flex flex-col gap-4 border-t border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Stage: {entry.stage}</p>
        <Button type="button" size="sm" onClick={() => advancePipelineStage(entry.id)}>Advance stage</Button>
      </div>
      {entry.checklist.map((item) => (
        <label key={item.id} className="flex items-center gap-2 text-sm">
          <Checkbox checked={item.done} onCheckedChange={(checked) => addChecklistDone(entry.id, item.id, checked === true)} />
          {item.description}
        </label>
      ))}
      <div className="flex flex-col gap-2">
        <Input type="date" value={date} aria-label="Visit date" onChange={(event) => setDate(event.target.value)} />
        <Textarea value={note} aria-label="Visit note" onChange={(event) => setNote(event.target.value)} />
        <Button type="button" variant="outline" onClick={() => addVisitRecord(entry.id, { date, note, picNip: entry.picNip })}>Add visit note</Button>
      </div>
      {entry.visitHistory.map((record, index) => (
        <p key={`${record.date}-${index}`} className="text-sm text-muted-foreground">
          {record.date} · {record.picNip}: {record.note}
        </p>
      ))}
    </div>
  )
}
