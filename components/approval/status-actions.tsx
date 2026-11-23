"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { isGmmEligible } from "@/src/domain/acquisition-status"
import { transitionStatus } from "@/src/data/store"
import type { AcquisitionSubmission } from "@/src/types/entities"

export function StatusActions({ submission }: { submission: AcquisitionSubmission }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  function accept(confirmed = false) {
    const result = transitionStatus(submission.id, "ACCEPTED_GMM", { confirmNonNewCif: confirmed })
    if (!result.ok && result.error === "CONFIRMATION_REQUIRED") setConfirmOpen(true)
  }

  function reject() {
    const result = transitionStatus(submission.id, "REJECTED", { note })
    if (!result.ok) {
      setError("A note is required before rejection.")
      return
    }
    setNoteOpen(false)
    setNote("")
    setError("")
  }

  if (submission.status === "COMPLETED" || submission.status === "REJECTED") return null
  return (
    <div className="flex gap-2">
      {submission.status === "WAITING_APPROVAL" ? (
        <>
          <Button type="button" size="sm" onClick={() => accept(isGmmEligible(submission.nbdsResult))}>
            Accept
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setNoteOpen(true)}>
            Reject
          </Button>
        </>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={() => transitionStatus(submission.id, "COMPLETED")}>
          Complete
        </Button>
      )}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection note</DialogTitle>
          </DialogHeader>
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} aria-label="Rejection note" />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <DialogFooter>
            <Button type="button" onClick={reject}>Reject submission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>This submission does not qualify for GMM</AlertDialogTitle>
            <AlertDialogDescription>
              Existing CIF and Unverified results need confirmation before Accepted (GMM).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => accept(true)}>Confirm acceptance</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
