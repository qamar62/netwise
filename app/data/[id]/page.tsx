'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { DocumentDetailsForm } from '@/components/document-details-form'
import { ClientForm } from '@/components/client-form'
import { LineItemsForm } from '@/components/line-items-form'
import { PricingSummary } from '@/components/pricing-summary'
import { NotesForm } from '@/components/notes-form'
import { DocumentPreview } from '@/components/document-preview'
import type { DocumentData, ClientInfo, LineItem } from '@/lib/types'
import {
  calculateSubtotal,
  calculateVAT,
  calculateGrandTotal,
  generateDocumentNumber,
} from '@/lib/document-store'
import { fetchInvoice, updateInvoice } from '@/lib/invoices-api'

interface PageProps {
  params: {
    id: string
  }
}

export default function InvoiceEditPage({ params }: PageProps) {
  const [data, setData] = useState<DocumentData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const record = await fetchInvoice(params.id)
        setData(record.data)
      } catch (error) {
        console.error('Failed to load invoice:', error)
        toast.error('Failed to load invoice')
      } finally {
        setIsLoading(false)
      }
    }

    loadInvoice()
  }, [params.id])

  const handleTypeChange = useCallback((type: 'invoice' | 'quotation') => {
    if (!data) return
    setData((prev) =>
      prev
        ? {
            ...prev,
            type,
            documentNumber: generateDocumentNumber(type),
            notes:
              type === 'invoice'
                ? 'Payment is due within 30 days. Thank you for your business!'
                : 'This quotation is valid for 30 days from the date of issue.',
          }
        : prev,
    )
  }, [data])

  const handleClientChange = useCallback((client: ClientInfo) => {
    setData((prev) => (prev ? { ...prev, client } : prev))
  }, [])

  const handleDocumentChange = useCallback((updates: Partial<DocumentData>) => {
    setData((prev) => (prev ? { ...prev, ...updates } : prev))
  }, [])

  const handleItemsChange = useCallback((items: LineItem[]) => {
    setData((prev) => (prev ? { ...prev, items } : prev))
  }, [])

  const handleSaveChanges = async () => {
    if (!data) return
    setIsSaving(true)
    try {
      const subtotal = calculateSubtotal(data.items)
      const vat = calculateVAT(subtotal, data.discount, data.vatRate)
      const total = calculateGrandTotal(subtotal, data.discount, vat)
      await updateInvoice(params.id, { data, subtotal, vat, total })
      toast.success('Invoice updated')
    } catch (error) {
      console.error('Failed to update invoice:', error)
      toast.error('Failed to update invoice')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header documentType={data?.type ?? 'invoice'} onTypeChange={handleTypeChange} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Edit invoice</h2>
            <p className="text-sm text-muted-foreground">Update the saved invoice details.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/data">
                <ArrowLeft className="h-4 w-4" />
                Back to data
              </Link>
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving || !data} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading invoice...</p>
        ) : !data ? (
          <p className="mt-6 text-sm text-destructive">Invoice not found.</p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <DocumentDetailsForm data={data} onChange={handleDocumentChange} />
              <ClientForm client={data.client} onChange={handleClientChange} />
              <LineItemsForm items={data.items} onChange={handleItemsChange} />
              <PricingSummary
                items={data.items}
                discount={data.discount}
                vatRate={data.vatRate}
                onDiscountChange={(discount) => handleDocumentChange({ discount })}
                onVatRateChange={(vatRate) => handleDocumentChange({ vatRate })}
              />
              <NotesForm
                notes={data.notes}
                paymentDetails={data.paymentDetails}
                onNotesChange={(notes) => handleDocumentChange({ notes })}
                onPaymentDetailsChange={(paymentDetails) => handleDocumentChange({ paymentDetails })}
              />
            </div>
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Preview</h2>
              <div className="overflow-auto rounded-lg shadow-lg">
                <DocumentPreview data={data} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
