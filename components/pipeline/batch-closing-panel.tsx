"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { batchMarkVisitsDone } from "@/src/data/store"
import { selectBatchClosable } from "@/src/domain/pipeline"
import type { BranchPipelineEntry } from "@/src/types/entities"

export function BatchClosingPanel({ entries }: { entries: BranchPipelineEntry[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const closable = selectBatchClosable(entries, today)
  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState("")

  function toggle(id: string, checked: boolean) {
    setSelected((current) => checked ? [...current, id] : current.filter((item) => item !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">Visits scheduled for {today}.</p>
      {closable.length === 0 ? <p className="text-sm">No scheduled visits for today.</p> : null}
      {closable.map((entry) => (
        <label key={entry.id} className="flex items-center gap-2 text-sm">
          <Checkbox checked={selected.includes(entry.id)} onCheckedChange={(checked) => toggle(entry.id, checked === true)} />
          {entry.customerName}
        </label>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setSelected(closable.map((entry) => entry.id))}>Select all</Button>
        <Button
          type="button"
          disabled={selected.length === 0}
          onClick={() => {
            const outcome = batchMarkVisitsDone(selected, today)
            setResult(`${outcome.updated} marked Done, ${outcome.skipped} skipped.`)
            setSelected([])
          }}
        >
          Mark Visit Done
        </Button>
      </div>
      {result ? <p className="text-sm">{result}</p> : null}
    </div>
  )
}
