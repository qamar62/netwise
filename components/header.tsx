'use client'

import { FileText, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/lib/types'

interface HeaderProps {
  documentType: 'invoice' | 'quotation'
  onTypeChange: (type: 'invoice' | 'quotation') => void
}

export function Header({ documentType, onTypeChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{COMPANY_INFO.name}</h1>
              <p className="text-sm text-muted-foreground">IT & Networking Solutions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={documentType === 'invoice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange('invoice')}
              className="gap-2"
            >
              <Receipt className="h-4 w-4" />
              Invoice
            </Button>
            <Button
              variant={documentType === 'quotation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange('quotation')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Quotation
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
