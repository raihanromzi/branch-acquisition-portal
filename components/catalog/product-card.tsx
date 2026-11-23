"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setIntakeDraft } from "@/src/data/store"
import type { Product } from "@/src/types/entities"

export function ProductCard({ product, onApply }: { product: Product; onApply: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="tabular-nums">{product.code}</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm">{product.description}</p></CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={() => {
            setIntakeDraft({ acquisitionType: product.acquisitionType, productCode: product.code })
            onApply()
          }}
        >
          Apply This Product
        </Button>
      </CardFooter>
    </Card>
  )
}
