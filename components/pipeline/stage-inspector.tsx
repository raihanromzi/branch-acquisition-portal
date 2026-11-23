"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircle2Icon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { STAGE_ORDER } from "@/src/domain/pipeline"
import { addChecklistDone, addVisitRecord, advancePipelineStage, getCatalog } from "@/src/data/store"
import type { BranchPipelineEntry, PipelineStage } from "@/src/types/entities"

const STAGE_TITLE: Record<PipelineStage, string> = {
  PROSPECTING: "Prospecting",
  PITCHING: "Pitching",
  DOCUMENTS: "Documents",
  MOU: "MoU / Agreement",
  ACQUISITION: "Acquisition / Live",
}

export function StageInspector({ entry, selectedStage }: { entry: BranchPipelineEntry; selectedStage: PipelineStage }) {
  const [note, setNote] = useState("")
  const [date, setDate] = useState("")
  const isCurrent = selectedStage === entry.stage
  const isFinal = entry.stage === "ACQUISITION"
  const staffMember = getCatalog().staff.find((staff) => staff.nip === entry.picNip)

  function addNote() {
    if (!note.trim()) return
    addVisitRecord(entry.id, {
      date: date || new Date().toISOString().slice(0, 10),
      note: note.trim(),
      picNip: entry.picNip,
    })
    setNote("")
  }

  return (
    <aside className="flex min-h-[520px] flex-col rounded-xl border border-border bg-card">
      <header className="border-b border-border p-4">
        <p className="text-xs font-medium text-muted-foreground">Step detail</p>
        <h3 className="mt-1 text-base font-semibold">{STAGE_TITLE[selectedStage]}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{entry.customerName}</p>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="grid gap-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><UserIcon className="size-3.5" /> {staffMember?.name ?? entry.picNip}</p>
          <p className="flex items-center gap-2"><CalendarIcon className="size-3.5" /> Visit {entry.scheduledDate}</p>
        </div>

        {isCurrent ? (
          <section>
            <p className="mb-3 text-xs font-semibold">Required checklist</p>
            <div className="flex flex-col gap-2.5">
              {entry.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-xs">
                  <Checkbox checked={item.done} onCheckedChange={(checked) => addChecklistDone(entry.id, item.id, checked === true)} />
                  <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.description}</span>
                </label>
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            {STAGE_ORDER.indexOf(selectedStage) < STAGE_ORDER.indexOf(entry.stage)
              ? "This stage is completed."
              : "This stage unlocks after the current step is completed."}
          </div>
        )}

        <section className="border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold">Visit history</p>
          <div className="flex max-h-32 flex-col gap-2 overflow-y-auto">
            {entry.visitHistory.length === 0 ? <p className="text-xs text-muted-foreground">No visit notes yet.</p> : null}
            {entry.visitHistory.map((record, index) => (
              <div key={`${record.date}-${index}`} className="rounded-md bg-muted/50 p-2 text-xs">
                <p className="font-medium">{record.date}</p>
                <p className="mt-0.5 text-muted-foreground">{record.note}</p>
              </div>
            ))}
          </div>
        </section>

        {isCurrent ? (
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <Input type="date" value={date} aria-label="Visit date" onChange={(event) => setDate(event.target.value)} />
            <Textarea value={note} aria-label="Visit note" placeholder="Add visit note..." onChange={(event) => setNote(event.target.value)} />
            <Button type="button" variant="outline" size="sm" onClick={addNote}>Add visit note</Button>
          </section>
        ) : null}
      </div>

      <footer className="border-t border-border p-4">
        <Button
          type="button"
          className="w-full"
          disabled={!isCurrent || isFinal}
          onClick={() => advancePipelineStage(entry.id)}
        >
          {isFinal ? <><CheckCircle2Icon data-icon="inline-start" />Pipeline complete</> : "Advance stage"}
        </Button>
      </footer>
    </aside>
  )
}
