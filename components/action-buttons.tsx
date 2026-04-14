'use client'

import { Download, Printer, Save, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import type { DocumentData } from '@/lib/types'
import { saveDraft, clearDraft, generateDocumentNumber } from '@/lib/document-store'

interface ActionButtonsProps {
  data: DocumentData
  onDataChange: (data: DocumentData) => void
  isGeneratingPdf: boolean
  isSavingIssued: boolean
  onGeneratePdf: () => void
  onSaveIssued: () => void
}

export function ActionButtons({
  data,
  onDataChange,
  isGeneratingPdf,
  isSavingIssued,
  onGeneratePdf,
  onSaveIssued,
}: ActionButtonsProps) {
  const handleSaveDraft = () => {
    saveDraft(data)
    toast.success('Draft saved successfully!')
  }

  const handleClearDraft = () => {
    clearDraft()
    toast.success('Draft cleared!')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewDocument = () => {
    const newNumber = generateDocumentNumber(data.type)
    onDataChange({
      ...data,
      documentNumber: newNumber,
    })
    toast.success('New document number generated!')
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onGeneratePdf} disabled={isGeneratingPdf} className="gap-2">
            {isGeneratingPdf ? (
              <>
                <Spinner className="h-4 w-4" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          <Button onClick={onSaveIssued} disabled={isSavingIssued} variant="outline" className="gap-2">
            {isSavingIssued ? (
              <>
                <Spinner className="h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Issued
              </>
            )}
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleNewDocument} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            New Number
          </Button>
          <Button onClick={handleClearDraft} variant="ghost" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
