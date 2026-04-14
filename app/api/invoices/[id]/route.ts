import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { data, error } = await supabaseServer
      .from('invoices')
      .select('id, document_number, type, client_name, created_at, total, subtotal, vat, data')
      .eq('id', context.params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const body = await request.json()
    const { data, subtotal, vat, total } = body ?? {}

    if (!data?.documentNumber) {
      return NextResponse.json({ error: 'Missing document data.' }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('invoices')
      .update({
        type: data.type,
        document_number: data.documentNumber,
        client_name: data.client?.name ?? null,
        data,
        subtotal,
        vat,
        total,
      })
      .eq('id', context.params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
