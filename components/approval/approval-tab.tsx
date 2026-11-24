import { ApprovalQueue } from "@/components/approval/approval-queue"
import { Frame, FrameHeader, FramePanel, FrameTitle } from "@/components/reui/frame"

export function ApprovalTab() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Approval queue</FrameTitle>
      </FrameHeader>
      <FramePanel className="flex flex-col gap-4">
        <ApprovalQueue />
      </FramePanel>
    </Frame>
  )
}
