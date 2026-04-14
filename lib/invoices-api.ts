import type { DocumentData } from '@/lib/types'

export interface SaveInvoicePayload {
  data: DocumentData
  subtotal: number
  vat: number
  total: number
}

export interface IssuedInvoiceRecord {
  id: string
  document_number: string
  type: 'invoice' | 'quotation'
  client_name: string | null
  created_at: string
  total: number
}

export interface IssuedInvoiceDetail extends IssuedInvoiceRecord {
  data: DocumentData
  subtotal: number
  vat: number
}

export async function saveInvoice(payload: SaveInvoicePayload) {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to save invoice')
  }

  return response.json()
}

export async function fetchInvoices(): Promise<IssuedInvoiceRecord[]> {
  const response = await fetch('/api/invoices', {
    method: 'GET',
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to load invoices')
  }

  const payload = (await response.json()) as { data: IssuedInvoiceRecord[] }
  return payload.data
}

export async function fetchInvoice(id: string): Promise<IssuedInvoiceDetail> {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'GET',
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to load invoice')
  }

  const payload = (await response.json()) as { data: IssuedInvoiceDetail }
  return payload.data
}

export async function updateInvoice(id: string, payload: SaveInvoicePayload) {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to update invoice')
  }

  return response.json()
}
