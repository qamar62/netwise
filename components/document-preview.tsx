'use client'

import { forwardRef } from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { DocumentData } from '@/lib/types'
import { COMPANY_INFO } from '@/lib/types'
import { calculateSubtotal, calculateVAT, calculateGrandTotal } from '@/lib/document-store'

interface DocumentPreviewProps {
  data: DocumentData
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(
  function DocumentPreview({ data }, ref) {
    const subtotal = calculateSubtotal(data.items)
    const vat = calculateVAT(subtotal, data.discount, data.vatRate)
    const grandTotal = calculateGrandTotal(subtotal, data.discount, vat)

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }

    return (
      <Card className="overflow-hidden" ref={ref}>
        <div className="bg-white p-8 text-gray-900" id="document-preview">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e3a5f]">
                  <span className="text-xl font-bold text-white">N</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">{COMPANY_INFO.name}</h1>
                  <p className="text-sm text-gray-500">IT & Networking Solutions</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>{COMPANY_INFO.email}</p>
                <p>{COMPANY_INFO.phone}</p>
                <p>{COMPANY_INFO.address}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold uppercase text-[#1e3a5f]">
                {data.type === 'invoice' ? 'Invoice' : 'Quotation'}
              </h2>
              <p className="mt-2 font-mono text-lg text-gray-700">{data.documentNumber}</p>
            </div>
          </div>

          <Separator className="my-6 bg-gray-200" />

          {/* Client & Document Info */}
          <div className="mb-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Bill To
              </h3>
              <div className="text-gray-700">
                <p className="font-semibold text-gray-900">{data.client.name || 'Client Name'}</p>
                {data.client.company && <p>{data.client.company}</p>}
                {data.client.email && <p>{data.client.email}</p>}
                {data.client.phone && <p>{data.client.phone}</p>}
                {data.client.address && (
                  <p className="whitespace-pre-line">{data.client.address}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <div className="flex justify-end gap-4">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(data.date)}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-sm text-gray-500">
                    {data.type === 'invoice' ? 'Due Date:' : 'Valid Until:'}
                  </span>
                  <span className="font-medium">{formatDate(data.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-[#1e3a5f] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Item / Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Unit Price</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.name || 'Item name'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.description || '-'}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mb-8 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(data.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>VAT ({data.vatRate}%)</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <Separator className="bg-gray-300" />
              <div className="flex justify-between text-lg font-bold text-[#1e3a5f]">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Payment Details */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            {data.notes && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Notes / Terms
                </h3>
                <p className="whitespace-pre-line text-sm text-gray-600">{data.notes}</p>
              </div>
            )}
            {data.paymentDetails && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Payment Details
                </h3>
                <p className="whitespace-pre-line text-sm text-gray-600">{data.paymentDetails}</p>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex justify-end">
              <div className="text-center">
                <div className="mb-2 h-16 w-48 border-b-2 border-gray-300"></div>
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Thank you for your business!</p>
            <p className="mt-1">
              {COMPANY_INFO.name} | {COMPANY_INFO.email} | {COMPANY_INFO.phone}
            </p>
          </div>
        </div>
      </Card>
    )
  }
)
