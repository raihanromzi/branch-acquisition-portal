"use client"

import { useState } from "react"

import { IntakeForm } from "@/components/intake/intake-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function IntakeTab() {
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acquisition intake</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {submittedId ? (
          <Alert>
            <AlertTitle>Submitted</AlertTitle>
            <AlertDescription>
              {submittedId} is Waiting for Approval. Open the Approval tab to review it.
            </AlertDescription>
          </Alert>
        ) : null}
        <IntakeForm onSubmitted={setSubmittedId} />
      </CardContent>
    </Card>
  )
}
