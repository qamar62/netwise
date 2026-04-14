'use client'

import { Plus, Trash2, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LineItem } from '@/lib/types'
import { createEmptyLineItem } from '@/lib/document-store'

interface LineItemsFormProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export function LineItemsForm({ items, onChange }: LineItemsFormProps) {
  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    onChange(updated)
  }

  const handleAddItem = () => {
    onChange([...items, createEmptyLineItem()])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      onChange(items.filter((item) => item.id !== id))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-secondary" />
            Items / Services
          </CardTitle>
          <Button onClick={handleAddItem} size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Item / Service</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="w-[100px] text-right">Qty</TableHead>
                <TableHead className="w-[130px] text-right">Unit Price</TableHead>
                <TableHead className="w-[130px] text-right">Total</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      placeholder="e.g., Network Setup"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="min-h-[40px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      rows={1}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                      }
                      className="border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                      }
                      className="border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="space-y-4 sm:hidden">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length === 1}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Item / Service name"
                  value={item.name}
                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                />
                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Unit Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="text-right text-sm font-medium">
                  Total: {formatCurrency(item.quantity * item.unitPrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
