import { ApprovalQueue } from "@/components/approval/approval-queue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApprovalTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Approval queue</CardTitle></CardHeader>
      <CardContent><ApprovalQueue /></CardContent>
    </Card>
  )
}
