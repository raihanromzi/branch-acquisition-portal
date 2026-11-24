"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { STATUS_LABEL } from "@/components/intake/status"
import { Badge, type BadgeProps } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { formatRupiah } from "@/src/domain/currency"
import { STAGE_LABEL, STAGE_ORDER } from "@/src/domain/pipeline"
import { getCatalog } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"
import type { AcquisitionStatus, BranchKpi, PipelineCategory } from "@/src/types/entities"
import { CalendarDaysIcon } from "lucide-react"

/** Target achievement at or above this share reads as on track. */
const ON_TRACK_TARGET_PERCENT = 90

const STATUS_BADGE: Record<AcquisitionStatus, BadgeProps["variant"]> = {
  WAITING_APPROVAL: "info-light",
  ACCEPTED_GMM: "success-light",
  REJECTED: "destructive-light",
  COMPLETED: "success-light",
}

const CATEGORIES: PipelineCategory[] = ["PAYROLL", "PRIORITY", "BUSINESS", "MERCHANT"]

const trendConfig = {
  submissions: { label: "Submissions", color: "var(--primary)" },
} satisfies ChartConfig

const stageConfig = {
  PAYROLL: { label: "Payroll", color: "var(--primary)" },
  PRIORITY: { label: "Priority", color: "var(--chart-2)" },
  BUSINESS: { label: "Business", color: "var(--chart-3)" },
  MERCHANT: { label: "Merchant", color: "var(--chart-4)" },
} satisfies ChartConfig

function KpiCard({
  label,
  value,
  badge,
  badgeVariant,
  footnote,
}: {
  label: string
  value: string
  badge: string
  badgeVariant: BadgeProps["variant"]
  footnote: string
}) {
  return (
    <Card className="gap-4">
      <CardContent className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-2xl font-medium tracking-tight tabular-nums">{value}</span>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">{footnote}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDay(isoDay: string) {
  return new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

function branchKpiFor(kpi: BranchKpi[], branchId: string | undefined) {
  return kpi.find((row) => row.branchId === branchId)
}

export function OverviewTab() {
  const { submissions, pipeline } = useStore()
  const { branches, kpi } = getCatalog()
  const branch = branches[0]
  const branchKpi = branchKpiFor(kpi, branch?.id)

  const pending = submissions.filter((item) => item.status === "WAITING_APPROVAL").length

  const submissionsPerDay = Object.entries(
    submissions.reduce<Record<string, number>>((days, item) => {
      const day = item.submittedAt.slice(0, 10)
      days[day] = (days[day] ?? 0) + 1
      return days
    }, {}),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce<{ day: string; submissions: number }[]>((rows, [day, count]) => {
      const total = (rows.at(-1)?.submissions ?? 0) + count
      return [...rows, { day: formatDay(day), submissions: total }]
    }, [])

  const stageData = STAGE_ORDER.map((stage) => {
    const row: Record<string, string | number> = { stage: STAGE_LABEL[stage] }
    for (const category of CATEGORIES) {
      row[category] = pipeline.filter((entry) => entry.stage === stage && entry.category === category).length
    }
    return row
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{branch?.name ?? "Branch"}</p>
          <p className="text-xs text-muted-foreground">Period {branchKpi?.period ?? "—"}</p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <CalendarDaysIcon data-icon="inline-start" />
          This month
        </Button>
      </div>

      {branchKpi ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Savings Portfolio"
            value={formatRupiah(branchKpi.savingsPortfolio)}
            badge={`${branchKpi.targetAchievementPercent}% of target`}
            badgeVariant={branchKpi.targetAchievementPercent >= ON_TRACK_TARGET_PERCENT ? "success-light" : "warning-light"}
            footnote="Branch savings portfolio for the period"
          />
          <KpiCard
            label="Merchant Growth"
            value={`${branchKpi.merchantGrowthPercent}%`}
            badge="Growth"
            badgeVariant="info-light"
            footnote={`${branchKpi.livinMerchantActivity} active Livin' Merchant`}
          />
          <KpiCard
            label="EDC Penetration"
            value={`${branchKpi.edcPenetrationPercent}%`}
            badge="Penetration"
            badgeVariant="info-light"
            footnote={`${branchKpi.wholesaleUnits} wholesale units (CB)`}
          />
          <KpiCard
            label="Waiting for Approval"
            value={String(pending)}
            badge={`${submissions.length} submitted`}
            badgeVariant={pending > 0 ? "warning-light" : "success-light"}
            footnote="Submissions in the approval queue"
          />
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No KPI data for this branch yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Cumulative submissions</CardTitle>
            <CardDescription>Running total of acquisition submissions by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-64 w-full">
              <AreaChart accessibilityLayer data={submissionsPerDay} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="overview-submissions-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-submissions)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-submissions)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="submissions"
                  type="monotone"
                  fill="url(#overview-submissions-fill)"
                  stroke="var(--color-submissions)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval summary</CardTitle>
            <CardDescription>Share of submissions by status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(Object.keys(STATUS_LABEL) as AcquisitionStatus[]).map((status) => {
              const count = submissions.filter((item) => item.status === status).length
              const share = submissions.length > 0 ? Math.round((count / submissions.length) * 100) : 0
              return (
                <div key={status} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</Badge>
                    <span className="text-sm font-medium tabular-nums">
                      {count} · {share}%
                    </span>
                  </div>
                  <Progress value={share} aria-label={`${STATUS_LABEL[status]} share`} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline by stage and category</CardTitle>
          <CardDescription>Customers in each acquisition stage, split by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={stageConfig} className="h-72 w-full">
            <BarChart accessibilityLayer data={stageData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} interval={0} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              {CATEGORIES.map((category) => (
                <Bar key={category} dataKey={category} stackId="stage" fill={`var(--color-${category})`} />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
