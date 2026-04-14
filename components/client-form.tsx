'use client'

import { User, Building2, Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import type { ClientInfo } from '@/lib/types'

interface ClientFormProps {
  client: ClientInfo
  onChange: (client: ClientInfo) => void
}

export function ClientForm({ client, onChange }: ClientFormProps) {
  const handleChange = (field: keyof ClientInfo, value: string) => {
    onChange({ ...client, [field]: value })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-secondary" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="clientName">Client Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  value={client.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="clientCompany">Company</FieldLabel>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientCompany"
                  placeholder="Acme Corporation"
                  value={client.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="clientEmail">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="clientPhone">Phone</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientPhone"
                  placeholder="+971 50 000 0000"
                  value={client.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="clientAddress">Billing Address</FieldLabel>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="clientAddress"
                placeholder="123 Business Street, Dubai, UAE"
                value={client.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="min-h-[80px] pl-10"
              />
            </div>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
