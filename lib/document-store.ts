'use client'

import type { DocumentData, LineItem } from './types'

const STORAGE_KEY = 'netwise_document_draft'

export function generateDocumentNumber(type: 'invoice' | 'quotation'): string {
  const prefix = type === 'invoice' ? 'INV' : 'QUO'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function generateItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function createEmptyLineItem(): LineItem {
  return {
    id: generateItemId(),
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
  }
}

export function createDefaultDocument(type: 'invoice' | 'quotation'): DocumentData {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(futureDate.getDate() + 30)

  return {
    type,
    documentNumber: generateDocumentNumber(type),
    date: today.toISOString().split('T')[0],
    dueDate: futureDate.toISOString().split('T')[0],
    client: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
    },
    items: [createEmptyLineItem()],
    notes: type === 'invoice' 
      ? 'Payment is due within 30 days. Thank you for your business!'
      : 'This quotation is valid for 30 days from the date of issue.',
    paymentDetails: 'Bank Transfer\nBank: Emirates NBD\nAccount Name: Netwise\nIBAN: AE00 0000 0000 0000 0000 000',
    discount: 0,
    vatRate: 5,
  }
}

export function saveDraft(data: DocumentData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadDraft(): DocumentData | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  
  try {
    return JSON.parse(stored) as DocumentData
  } catch {
    return null
  }
}

export function clearDraft(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

export function calculateVAT(subtotal: number, discount: number, vatRate: number): number {
  const afterDiscount = subtotal - discount
  return afterDiscount * (vatRate / 100)
}

export function calculateGrandTotal(subtotal: number, discount: number, vat: number): number {
  return subtotal - discount + vat
}
