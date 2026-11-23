import { Badge } from "@/components/ui/badge"
import { NBDS_LABEL } from "@/components/intake/status"
import type { NbdsResult } from "@/src/types/entities"

export function NbdsLog({ result }: { result: NbdsResult }) {
  return (
    <Badge variant={result === "NEW_CIF" ? "secondary" : "outline"}>
      {NBDS_LABEL[result]}
    </Badge>
  )
}
