export interface LineItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

export interface ClientInfo {
  name: string
  company: string
  email: string
  phone: string
  address: string
}

export interface DocumentData {
  type: 'invoice' | 'quotation'
  documentNumber: string
  date: string
  dueDate: string // Due Date for Invoice, Valid Until for Quotation
  client: ClientInfo
  items: LineItem[]
  notes: string
  paymentDetails: string
  discount: number
  vatRate: number
}

export interface CompanyInfo {
  name: string
  email: string
  phone: string
  address: string
}

export const COMPANY_INFO: CompanyInfo = {
  name: 'Netwise',
  email: 'sarfrazibrahim@outlook.com',
  phone: '+971 50 883 6613',
  address: 'Dubai, UAE',
}

export const VAT_RATE = 5 // UAE VAT 5%
