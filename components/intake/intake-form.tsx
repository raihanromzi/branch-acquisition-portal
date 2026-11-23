"use client"

import { useEffect, useState } from "react"

import { DateField } from "@/components/intake/date-field"
import { NipField } from "@/components/intake/nip-field"
import { ProductSelect } from "@/components/intake/product-select"
import { RupiahInput } from "@/components/intake/rupiah-input"
import { TYPE_LABEL } from "@/components/intake/status"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { clearIntakeDraft, submitAcquisition } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"
import type { AcquisitionType } from "@/src/types/entities"

const TYPES = Object.keys(TYPE_LABEL) as AcquisitionType[]

const empty = {
  acquisitionType: "INDIVIDUAL" as AcquisitionType,
  nip: "",
  customerName: "",
  cif: "",
  productCode: "",
  visitDate: "",
  amount: undefined as number | undefined,
  estimatedEmployees: "",
  estimatedAum: undefined as number | undefined,
  edcType: "",
  estimatedSalesVolume: undefined as number | undefined,
}

export function IntakeForm({ onSubmitted }: { onSubmitted: (id: string) => void }) {
  const { intakeDraft } = useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!intakeDraft) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirroring external store data into local form state on catalog prefill
    setForm((current) => ({
      ...current,
      acquisitionType: intakeDraft.acquisitionType,
      productCode: intakeDraft.productCode,
    }))
    clearIntakeDraft()
  }, [intakeDraft])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    const payload = {
      ...form,
      estimatedEmployees: form.estimatedEmployees ? Number(form.estimatedEmployees) : undefined,
    }
    const result = submitAcquisition(payload)
    if (!result.ok) {
      setErrors(result.fieldErrors)
      return
    }
    setErrors({})
    setForm(empty)
    onSubmitted(result.submission.id)
  }

  const type = form.acquisitionType
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="flex flex-col gap-2">
        <Label>Acquisition type</Label>
        <Select value={type} onValueChange={(value) => update("acquisitionType", value as AcquisitionType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TYPES.map((item) => (
                <SelectItem key={item} value={item}>
                  {TYPE_LABEL[item]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <NipField value={form.nip} error={errors.nip} onChange={(value) => update("nip", value)} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="customerName">Customer name</Label>
        <Input id="customerName" value={form.customerName} aria-invalid={Boolean(errors.customerName)} onChange={(event) => update("customerName", event.target.value)} />
        {errors.customerName ? <p className="text-sm text-danger">{errors.customerName}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="cif">CIF</Label>
        <Input id="cif" value={form.cif} onChange={(event) => update("cif", event.target.value)} />
      </div>
      <ProductSelect type={type} value={form.productCode} error={errors.productCode} onChange={(value) => update("productCode", value)} />
      <DateField value={form.visitDate} error={errors.visitDate} onChange={(value) => update("visitDate", value)} />
      {type === "INDIVIDUAL" || type === "BUSINESS" ? (
        <RupiahInput id="amount" label="Amount" value={form.amount} error={errors.amount} onChange={(value) => update("amount", value)} />
      ) : null}
      {type === "PAYROLL" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="estimatedEmployees">Estimated employees</Label>
          <Input id="estimatedEmployees" inputMode="numeric" className="text-right tabular-nums" value={form.estimatedEmployees} aria-invalid={Boolean(errors.estimatedEmployees)} onChange={(event) => update("estimatedEmployees", event.target.value)} />
          {errors.estimatedEmployees ? <p className="text-sm text-danger">{errors.estimatedEmployees}</p> : null}
        </div>
      ) : null}
      {type === "PRIORITY" ? (
        <RupiahInput id="estimatedAum" label="Estimated AUM" value={form.estimatedAum} error={errors.estimatedAum} onChange={(value) => update("estimatedAum", value)} />
      ) : null}
      {type === "MERCHANT_OTBR" ? (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edcType">EDC type</Label>
            <Input id="edcType" value={form.edcType} aria-invalid={Boolean(errors.edcType)} onChange={(event) => update("edcType", event.target.value)} />
            {errors.edcType ? <p className="text-sm text-danger">{errors.edcType}</p> : null}
          </div>
          <RupiahInput id="estimatedSalesVolume" label="Estimated sales volume" value={form.estimatedSalesVolume} error={errors.estimatedSalesVolume} onChange={(value) => update("estimatedSalesVolume", value)} />
        </>
      ) : null}
      <Button type="submit">Submit acquisition</Button>
    </form>
  )
}
