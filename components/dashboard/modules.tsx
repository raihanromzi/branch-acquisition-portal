import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  MapIcon,
  PackageIcon,
  FileSpreadsheetIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react"

export const MODULES = [
  { id: "intake", label: "Intake", icon: ClipboardListIcon },
  { id: "approval", label: "Approval", icon: ShieldCheckIcon },
  { id: "pipeline", label: "Pipeline", icon: LayoutDashboardIcon },
  { id: "monitoring", label: "Monitoring", icon: MapIcon },
  { id: "catalog", label: "Catalog", icon: PackageIcon },
  { id: "reports", label: "Reports", icon: FileSpreadsheetIcon },
] as const satisfies readonly { id: string; label: string; icon: LucideIcon }[]

export type ModuleId = (typeof MODULES)[number]["id"]
