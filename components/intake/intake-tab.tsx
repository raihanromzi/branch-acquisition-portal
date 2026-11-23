"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon, SmartphoneIcon } from "lucide-react"

import { IntakeForm } from "@/components/intake/intake-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="flex flex-col gap-6">
      {/* Field Sales External Form Banner */}
      <Card className="rounded-2xl border-border bg-gradient-to-br from-zinc-50 to-background p-2 shadow-xs dark:from-zinc-950 dark:to-card">
        <CardHeader className="flex flex-col gap-2 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <SmartphoneIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Formulir Sales Lapangan (Tab Terpisah)</CardTitle>
              <CardDescription className="text-xs">
                Khusus tim sales di jalan tanpa perlu login atau membuka dashboard.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Formulir akuisisi publik yang teroptimasi untuk perangkat mobile. Data yang diinput oleh sales
            akan langsung tersinkronisasi secara otomatis ke antrean <strong>Approval</strong> di dashboard ini.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              className="h-10 rounded-xl bg-black font-semibold text-white hover:bg-zinc-800"
              onClick={() => window.open("/submit", "_blank")}
            >
              <ExternalLinkIcon className="size-4" data-icon="inline-start" />
              Buka Formulir di Tab Baru (/submit)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <CheckIcon className="size-4 text-emerald-600" data-icon="inline-start" />
                  Tautan Tersalin!
                </>
              ) : (
                <>
                  <CopyIcon className="size-4" data-icon="inline-start" />
                  Salin Tautan untuk Tim Sales
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Internal Branch Desk Intake */}
      <Card className="rounded-2xl border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Input Langsung dari Branch (Opsional)</CardTitle>
            <CardDescription className="text-xs">
              Gunakan jika staf cabang ingin menginput pengajuan langsung dari meja kerja.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowInternalForm(!showInternalForm)}
          >
            {showInternalForm ? "Sembunyikan Form" : "Tampilkan Form"}
          </Button>
        </CardHeader>

        {showInternalForm ? (
          <CardContent className="flex flex-col gap-4 pt-2">
            {submittedId ? (
              <Alert>
                <AlertTitle>Pengajuan Tersimpan</AlertTitle>
                <AlertDescription>
                  {submittedId} telah masuk antrean Waiting for Approval.
                </AlertDescription>
              </Alert>
            ) : null}
            <IntakeForm onSubmitted={setSubmittedId} />
          </CardContent>
        ) : null}
      </Card>
    </div>
  )
}
