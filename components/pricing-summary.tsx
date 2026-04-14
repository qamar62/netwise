'use client'

import { Calculator, Percent, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import type { LineItem } from '@/lib/types'
import { calculateSubtotal, calculateVAT, calculateGrandTotal } from '@/lib/document-store'

interface PricingSummaryProps {
  items: LineItem[]
  discount: number
  vatRate: number
  onDiscountChange: (discount: number) => void
  onVatRateChange: (vatRate: number) => void
}

export function PricingSummary({
  items,
  discount,
  vatRate,
  onDiscountChange,
  onVatRateChange,
}: PricingSummaryProps) {
  const subtotal = calculateSubtotal(items)
  const vat = calculateVAT(subtotal, discount, vatRate)
  const grandTotal = calculateGrandTotal(subtotal, discount, vat)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-secondary" />
          Pricing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="discount" className="flex items-center gap-1 text-sm">
              <Tag className="h-3 w-3" />
              Discount (AED)
            </FieldLabel>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="vatRate" className="flex items-center gap-1 text-sm">
              <Percent className="h-3 w-3" />
              VAT Rate (%)
            </FieldLabel>
            <Input
              id="vatRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={vatRate}
              onChange={(e) => onVatRateChange(parseFloat(e.target.value) || 0)}
            />
          </Field>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">VAT ({vatRate}%)</span>
          <span className="font-medium">{formatCurrency(vat)}</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Grand Total</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
