import { Badge, type BadgeProps } from "@/components/reui/badge"
import { NBDS_LABEL } from "@/components/intake/status"
import type { NbdsResult } from "@/src/types/entities"

/** NEW_CIF is informational, UNVERIFIED needs attention (warning token), EXISTING is neutral. */
const NBDS_BADGE: Record<NbdsResult, BadgeProps["variant"]> = {
  NEW_CIF: "info-light",
  EXISTING_CIF: "outline",
  UNVERIFIED: "warning-light",
}

export function NbdsLog({ result }: { result: NbdsResult }) {
  return <Badge variant={NBDS_BADGE[result]}>{NBDS_LABEL[result]}</Badge>
}
