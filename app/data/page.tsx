'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { fetchInvoices, type IssuedInvoiceRecord } from '@/lib/invoices-api'

export default function DataPage() {
  const [records, setRecords] = useState<IssuedInvoiceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInvoices()
        setRecords(data)
      } catch (error) {
        console.error('Failed to load invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const totals = useMemo(() => {
    return records.reduce((sum, record) => sum + (record.total || 0), 0)
  }, [records])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Saved invoices</h2>
            <p className="text-sm text-muted-foreground">Manage your issued invoices and quotations.</p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to generator
            </Link>
          </Button>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Total issued value</p>
              <p className="text-xl font-semibold text-foreground">AED {totals.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{records.length} records</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading invoices...</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices saved yet.</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{record.document_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {record.client_name || 'Unnamed client'} · {record.type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">AED {record.total.toFixed(2)}</span>
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <Link href={`/data/${record.id}`}>
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
