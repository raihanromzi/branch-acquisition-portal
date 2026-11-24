import {
  ClipboardListIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  MapIcon,
  PackageIcon,
  ShieldCheckIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react"

export const MODULES = [
  {
    id: "overview",
    label: "Dashboard",
    description: "Branch KPIs, pipeline stages and approvals at a glance.",
    icon: LayoutDashboardIcon,
  },
  {
    id: "intake",
    label: "Intake",
    description: "Capture new acquisition opportunities.",
    icon: ClipboardListIcon,
  },
  {
    id: "approval",
    label: "Approval",
    description: "Review and approve acquisition submissions.",
    icon: ShieldCheckIcon,
  },
  {
    id: "pipeline",
    label: "Pipeline",
    description: "Track branch prospects and scheduled visits.",
    icon: WorkflowIcon,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    description: "View branch KPIs and merchant activity.",
    icon: MapIcon,
  },
  {
    id: "catalog",
    label: "Catalog",
    description: "Present products and calculate simulations.",
    icon: PackageIcon,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Print executive summaries and export data.",
    icon: FileSpreadsheetIcon,
  },
] as const satisfies readonly {
  id: string
  label: string
  description: string
  icon: LucideIcon
}[]

export type ModuleId = (typeof MODULES)[number]["id"]
