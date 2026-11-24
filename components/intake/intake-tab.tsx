"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"

import { IntakeForm } from "@/components/intake/intake-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert"
import { Frame, FrameHeader, FramePanel, FrameTitle, FrameDescription } from "@/components/reui/frame"
import { Button } from "@/components/ui/button"

export function IntakeTab() {
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showInternalForm, setShowInternalForm] = useState(false)

  function copyLink() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/submit` : "/submit"
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Frame>
        <FrameHeader>
          <FrameTitle>Field sales form</FrameTitle>
          <FrameDescription>
            Sales staff submit from a phone without logging in. Submissions go straight to the approval queue.
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => window.open("/submit", "_blank")}>
            <ExternalLinkIcon data-icon="inline-start" />
            Open form in new tab
          </Button>
          <Button type="button" variant="outline" onClick={copyLink}>
            {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? "Link copied" : "Copy link for sales team"}
          </Button>
        </FramePanel>
      </Frame>

      <Frame>
        <FrameHeader>
          <FrameTitle>Enter directly at the branch</FrameTitle>
          <FrameDescription>Optional. Use this when branch staff enter a submission at their desk.</FrameDescription>
        </FrameHeader>
        <FramePanel className="flex flex-col gap-4">
          <div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowInternalForm(!showInternalForm)}>
              {showInternalForm ? "Hide form" : "Show form"}
            </Button>
          </div>
          {showInternalForm ? (
            <>
              {submittedId ? (
                <Alert variant="success">
                  <AlertTitle>Submission saved</AlertTitle>
                  <AlertDescription>{submittedId} is in the waiting-for-approval queue.</AlertDescription>
                </Alert>
              ) : null}
              <IntakeForm onSubmitted={setSubmittedId} />
            </>
          ) : null}
        </FramePanel>
      </Frame>
    </div>
  )
}
