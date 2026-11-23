"use client"

import { BatchClosingPanel } from "@/components/pipeline/batch-closing-panel"
import { PipelineMatrix } from "@/components/pipeline/pipeline-matrix"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/src/data/use-store"

export function PipelineTab() {
  const { pipeline } = useStore()
  return (
    <Tabs defaultValue="matrix">
      <TabsList>
        <TabsTrigger value="matrix">Matrix</TabsTrigger>
        <TabsTrigger value="batch">Batch closing</TabsTrigger>
      </TabsList>
      <TabsContent value="matrix">
        <Card><CardHeader><CardTitle>Pipeline</CardTitle></CardHeader><CardContent><PipelineMatrix /></CardContent></Card>
      </TabsContent>
      <TabsContent value="batch">
        <Card><CardHeader><CardTitle>Batch closing</CardTitle></CardHeader><CardContent><BatchClosingPanel entries={pipeline} /></CardContent></Card>
      </TabsContent>
    </Tabs>
  )
}
