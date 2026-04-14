'use client'

import { Hash, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import type { DocumentData } from '@/lib/types'

interface DocumentDetailsFormProps {
  data: DocumentData
  onChange: (updates: Partial<DocumentData>) => void
}

export function DocumentDetailsForm({ data, onChange }: DocumentDetailsFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hash className="h-5 w-5 text-secondary" />
          {data.type === 'invoice' ? 'Invoice' : 'Quotation'} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="documentNumber">
              {data.type === 'invoice' ? 'Invoice' : 'Quote'} Number
            </FieldLabel>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="documentNumber"
                value={data.documentNumber}
                onChange={(e) => onChange({ documentNumber: e.target.value })}
                className="pl-10 font-mono"
              />
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => onChange({ date: e.target.value })}
                  className="pl-10"
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="dueDate">
                {data.type === 'invoice' ? 'Due Date' : 'Valid Until'}
              </FieldLabel>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => onChange({ dueDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
