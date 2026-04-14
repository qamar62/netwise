'use client'

import { FileText, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface NotesFormProps {
  notes: string
  paymentDetails: string
  onNotesChange: (notes: string) => void
  onPaymentDetailsChange: (paymentDetails: string) => void
}

export function NotesForm({
  notes,
  paymentDetails,
  onNotesChange,
  onPaymentDetailsChange,
}: NotesFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-secondary" />
          Notes & Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="notes">Notes / Terms & Conditions</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or terms..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="paymentDetails" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Payment Details
            </FieldLabel>
            <Textarea
              id="paymentDetails"
              placeholder="Bank name, account number, IBAN..."
              value={paymentDetails}
              onChange={(e) => onPaymentDetailsChange(e.target.value)}
              rows={4}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
