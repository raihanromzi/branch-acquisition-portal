"use client"

import { useMemo, useState } from "react"
import { CheckCircle2Icon, Loader2Icon, ShieldCheckIcon } from "lucide-react"

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
import { products } from "@/src/data/seed/products"
import { staff } from "@/src/data/seed/staff"
import { formatRupiah, parseRupiah } from "@/src/domain/currency"
import type { AcquisitionType } from "@/src/types/entities"

const TYPES: { id: AcquisitionType; label: string; desc: string }[] = [
  { id: "INDIVIDUAL", label: "Individual", desc: "Tabungan / Deposito Perorangan" },
  { id: "BUSINESS", label: "Business", desc: "Giro Bisnis & Modal Kerja" },
  { id: "PAYROLL", label: "Corporate Payroll", desc: "Paket Penggajian Karyawan" },
  { id: "PRIORITY", label: "Priority & Wealth", desc: "Nasabah Prioritas & Wealth Management" },
  { id: "MERCHANT_OTBR", label: "Merchant & EDC (OTBR)", desc: "Pemasangan EDC / QRIS Merchant" },
]

export default function SubmitPage() {
  const [nip, setNip] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [cif, setCif] = useState("")
  const [acquisitionType, setAcquisitionType] = useState<AcquisitionType>("INDIVIDUAL")
  const [productCode, setProductCode] = useState("SAV-TAB-001")
  const [visitDate, setVisitDate] = useState("")
  const [amountRaw, setAmountRaw] = useState("")
  const [estimatedEmployees, setEstimatedEmployees] = useState("")
  const [estimatedAumRaw, setEstimatedAumRaw] = useState("")
  const [edcType, setEdcType] = useState("Countertop EDC")
  const [estimatedSalesRaw, setEstimatedSalesRaw] = useState("")

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const verifiedStaff = useMemo(() => {
    const cleaned = nip.replace(/\D/g, "")
    if (cleaned.length !== 18) return null
    return staff.find((s) => s.nip === cleaned) ?? null
  }, [nip])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.acquisitionType === acquisitionType)
  }, [acquisitionType])

  function handleTypeChange(val: AcquisitionType) {
    setAcquisitionType(val)
    const available = products.filter((p) => p.acquisitionType === val)
    if (available[0]) {
      setProductCode(available[0].code)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const cleanedNip = nip.replace(/\D/g, "")
    if (cleanedNip.length !== 18) {
      setErrors({ nip: "NIP harus tepat 18 digit angka." })
      return
    }

    if (!verifiedStaff) {
      setErrors({ nip: "NIP tidak ditemukan dalam database master pegawai." })
      return
    }

    if (!customerName.trim()) {
      setErrors({ customerName: "Nama nasabah / perusahaan wajib diisi." })
      return
    }

    const payload: Record<string, unknown> = {
      nip: cleanedNip,
      customerName: customerName.trim(),
      cif: cif.trim() || undefined,
      acquisitionType,
      productCode,
      visitDate: visitDate || new Date().toISOString().slice(0, 10),
    }

    if (acquisitionType === "INDIVIDUAL" || acquisitionType === "BUSINESS") {
      const parsed = parseRupiah(amountRaw)
      if (!parsed || parsed <= 0) {
        setErrors({ amount: "Nominal pengajuan wajib diisi angka valid." })
        return
      }
      payload.amount = parsed
    } else if (acquisitionType === "PAYROLL") {
      const emp = Number(estimatedEmployees)
      if (!emp || emp <= 0) {
        setErrors({ estimatedEmployees: "Estimasi jumlah karyawan wajib diisi." })
        return
      }
      payload.estimatedEmployees = emp
    } else if (acquisitionType === "PRIORITY") {
      const parsed = parseRupiah(estimatedAumRaw)
      if (!parsed || parsed < 500_000_000) {
        setErrors({ estimatedAum: "Estimasi AUM minimal Rp 500.000.000." })
        return
      }
      payload.estimatedAum = parsed
    } else if (acquisitionType === "MERCHANT_OTBR") {
      if (!edcType.trim()) {
        setErrors({ edcType: "Tipe EDC wajib diisi." })
        return
      }
      const sales = parseRupiah(estimatedSalesRaw)
      if (sales === null || sales < 0) {
        setErrors({ estimatedSalesVolume: "Estimasi sales volume wajib diisi." })
        return
      }
      payload.edcType = edcType.trim()
      payload.estimatedSalesVolume = sales
    }

    setLoading(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors)
        } else {
          setErrors({ general: data.message || "Gagal mengirim pengajuan. Coba lagi." })
        }
        return
      }
      setSubmittedId(data.submission.id)
    } catch {
      setErrors({ general: "Terjadi gangguan koneksi jaringan. Coba lagi." })
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSubmittedId(null)
    setCustomerName("")
    setCif("")
    setAmountRaw("")
    setEstimatedEmployees("")
    setEstimatedAumRaw("")
    setEstimatedSalesRaw("")
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 shadow-xs">
            <ShieldCheckIcon className="size-4 text-emerald-600" />
            <span className="text-xs font-semibold tracking-tight">Bank Mandiri · Sales Field Form</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Acquisition Intake
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Input akuisisi langsung dari lapangan. Data otomatis tersinkronisasi ke sistem monitoring cabang.
          </p>
        </header>

        {submittedId ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2Icon className="size-8" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">Pengajuan Berhasil Dikirim!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nomor referensi pengajuan: <span className="font-semibold text-foreground">{submittedId}</span>
              </p>
              <div className="mt-4 w-full rounded-xl bg-muted/40 p-4 text-left text-xs text-muted-foreground">
                <p>Status: <span className="font-medium text-foreground">Waiting for Approval</span></p>
                <p className="mt-1">Petugas: <span className="font-medium text-foreground">{verifiedStaff?.name} ({verifiedStaff?.nip})</span></p>
                <p className="mt-1">Nasabah: <span className="font-medium text-foreground">{customerName}</span></p>
              </div>
              <Button
                type="button"
                onClick={handleReset}
                className="mt-6 h-11 w-full rounded-xl bg-black font-semibold text-white hover:bg-zinc-800"
              >
                Kirim Pengajuan Baru
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8"
          >
            {errors.general ? (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
                {errors.general}
              </div>
            ) : null}

            <div className="flex flex-col gap-6">
              {/* NIP Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="nip" className="text-sm font-semibold text-foreground">
                  NIP Sales Officer (18 Digit)
                </Label>
                <Input
                  id="nip"
                  inputMode="numeric"
                  placeholder="Contoh: 198503152010121001"
                  value={nip}
                  onChange={(e) => setNip(e.target.value.replace(/\D/g, "").slice(0, 18))}
                  className="h-11 rounded-xl border-input bg-background px-3.5 text-sm tabular-nums shadow-xs"
                />
                {verifiedStaff ? (
                  <p className="text-xs font-medium text-emerald-600">
                    Terverifikasi: {verifiedStaff.name} ({verifiedStaff.branchId})
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Masukkan NIP pegawai aktif Anda untuk verifikasi identitas cabang.
                  </p>
                )}
                {errors.nip ? <p className="text-xs font-medium text-rose-600">{errors.nip}</p> : null}
              </div>

              {/* Customer Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName" className="text-sm font-semibold text-foreground">
                  Nama Nasabah / Perusahaan
                </Label>
                <Input
                  id="customerName"
                  placeholder="Contoh: PT Sumber Makmur Sentosa"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11 rounded-xl border-input bg-background px-3.5 text-sm shadow-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Nama lengkap nasabah perorangan atau nama resmi badan usaha.
                </p>
                {errors.customerName ? (
                  <p className="text-xs font-medium text-rose-600">{errors.customerName}</p>
                ) : null}
              </div>

              {/* CIF (Optional) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="cif" className="text-sm font-semibold text-foreground">
                  Nomor CIF (Opsional)
                </Label>
                <Input
                  id="cif"
                  placeholder="Contoh: 1002003001"
                  value={cif}
                  onChange={(e) => setCif(e.target.value)}
                  className="h-11 rounded-xl border-input bg-background px-3.5 text-sm tabular-nums shadow-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan bila calon nasabah baru (New CIF).
                </p>
              </div>

              {/* Acquisition Type */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Jenis Akuisisi
                </Label>
                <Select value={acquisitionType} onValueChange={(v) => handleTypeChange(v as AcquisitionType)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-input bg-background px-3.5 text-sm shadow-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectGroup>
                      {TYPES.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {TYPES.find((t) => t.id === acquisitionType)?.desc}
                </p>
              </div>

              {/* Product */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Produk Mandiri
                </Label>
                <Select value={productCode} onValueChange={setProductCode}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-input bg-background px-3.5 text-sm shadow-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectGroup>
                      {filteredProducts.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          {p.name} ({p.code})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.productCode ? (
                  <p className="text-xs font-medium text-rose-600">{errors.productCode}</p>
                ) : null}
              </div>

              {/* Visit Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="visitDate" className="text-sm font-semibold text-foreground">
                  Tanggal Kunjungan / Pertemuan
                </Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="h-11 rounded-xl border-input bg-background px-3.5 text-sm shadow-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Tanggal pelaksanaan kunjungan atau kesepakatan awal dengan nasabah.
                </p>
                {errors.visitDate ? (
                  <p className="text-xs font-medium text-rose-600">{errors.visitDate}</p>
                ) : null}
              </div>

              {/* Type-Specific Fields */}
              {acquisitionType === "INDIVIDUAL" || acquisitionType === "BUSINESS" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
                    Estimasi Nominal Penempatan (Rupiah)
                  </Label>
                  <Input
                    id="amount"
                    inputMode="decimal"
                    placeholder="Contoh: 15.000.000"
                    value={amountRaw}
                    onChange={(e) => setAmountRaw(e.target.value)}
                    onBlur={() => {
                      const p = parseRupiah(amountRaw)
                      if (p !== null) setAmountRaw(formatRupiah(p))
                    }}
                    className="h-11 rounded-xl border-input bg-background px-3.5 text-right text-sm tabular-nums shadow-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format otomatis terformat ke Rupiah setelah selesai mengetik.
                  </p>
                  {errors.amount ? (
                    <p className="text-xs font-medium text-rose-600">{errors.amount}</p>
                  ) : null}
                </div>
              ) : null}

              {acquisitionType === "PAYROLL" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="employees" className="text-sm font-semibold text-foreground">
                    Estimasi Jumlah Karyawan
                  </Label>
                  <Input
                    id="employees"
                    inputMode="numeric"
                    placeholder="Contoh: 150"
                    value={estimatedEmployees}
                    onChange={(e) => setEstimatedEmployees(e.target.value.replace(/\D/g, ""))}
                    className="h-11 rounded-xl border-input bg-background px-3.5 text-right text-sm tabular-nums shadow-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Perkiraan jumlah karyawan yang akan dibuka rekening payroll.
                  </p>
                  {errors.estimatedEmployees ? (
                    <p className="text-xs font-medium text-rose-600">{errors.estimatedEmployees}</p>
                  ) : null}
                </div>
              ) : null}

              {acquisitionType === "PRIORITY" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="aum" className="text-sm font-semibold text-foreground">
                    Estimasi Total AUM (Min. Rp 500 Juta)
                  </Label>
                  <Input
                    id="aum"
                    inputMode="decimal"
                    placeholder="Contoh: 750.000.000"
                    value={estimatedAumRaw}
                    onChange={(e) => setEstimatedAumRaw(e.target.value)}
                    onBlur={() => {
                      const p = parseRupiah(estimatedAumRaw)
                      if (p !== null) setEstimatedAumRaw(formatRupiah(p))
                    }}
                    className="h-11 rounded-xl border-input bg-background px-3.5 text-right text-sm tabular-nums shadow-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Sesuai ketentuan minimum nasabah prioritas Bank Mandiri.
                  </p>
                  {errors.estimatedAum ? (
                    <p className="text-xs font-medium text-rose-600">{errors.estimatedAum}</p>
                  ) : null}
                </div>
              ) : null}

              {acquisitionType === "MERCHANT_OTBR" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-foreground">
                      Tipe Perangkat EDC
                    </Label>
                    <Select value={edcType} onValueChange={setEdcType}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-input bg-background px-3.5 text-sm shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectItem value="Countertop EDC">Countertop EDC</SelectItem>
                          <SelectItem value="Wireless / Mobile EDC">Wireless / Mobile EDC</SelectItem>
                          <SelectItem value="QRIS Soundbox">QRIS Soundbox</SelectItem>
                          <SelectItem value="Livin' Merchant App">Livin&apos; Merchant App</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sales" className="text-sm font-semibold text-foreground">
                      Estimasi Omset Bulanan Merchant (Rupiah)
                    </Label>
                    <Input
                      id="sales"
                      inputMode="decimal"
                      placeholder="Contoh: 25.000.000"
                      value={estimatedSalesRaw}
                      onChange={(e) => setEstimatedSalesRaw(e.target.value)}
                      onBlur={() => {
                        const p = parseRupiah(estimatedSalesRaw)
                        if (p !== null) setEstimatedSalesRaw(formatRupiah(p))
                      }}
                      className="h-11 rounded-xl border-input bg-background px-3.5 text-right text-sm tabular-nums shadow-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Perkiraan rata-rata volume transaksi bulanan merchant.
                    </p>
                    {errors.estimatedSalesVolume ? (
                      <p className="text-xs font-medium text-rose-600">{errors.estimatedSalesVolume}</p>
                    ) : null}
                  </div>
                </>
              ) : null}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl bg-black font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" data-icon="inline-start" />
                    Mengirim Pengajuan...
                  </>
                ) : (
                  "Kirim Pengajuan Akuisisi"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
