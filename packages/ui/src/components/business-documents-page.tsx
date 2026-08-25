"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  CheckmarkCircle01Icon,
  Upload04Icon,
  Download04Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/toast"

interface DocumentItem {
  id: string
  title: string
  authority: string
  documentNumber: string
  status: "verified" | "pending" | "required"
  uploadedAt: string
  fileName?: string
}

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "brela",
    title: "Certificate of Incorporation / Registration",
    authority: "BRELA (Business Registrations and Licensing Agency)",
    documentNumber: "BN-158429",
    status: "verified",
    uploadedAt: "4 March 2026",
    fileName: "BRELA_Certificate_Zerixa.pdf",
  },
  {
    id: "tin",
    title: "Taxpayer Identification Certificate (TIN)",
    authority: "TRA (Tanzania Revenue Authority)",
    documentNumber: "154-892-340",
    status: "verified",
    uploadedAt: "4 March 2026",
    fileName: "TRA_TIN_Certificate.pdf",
  },
  {
    id: "license",
    title: "Business License (Leseni ya Biashara)",
    authority: "Municipal Council / Ministry of Industry & Trade",
    documentNumber: "BL-2026-99120",
    status: "verified",
    uploadedAt: "4 March 2026",
    fileName: "Business_License_2026.pdf",
  },
  {
    id: "memorandum",
    title: "Memorandum & Articles of Association / Extract",
    authority: "Company Legal Documentation",
    documentNumber: "MAA-DOC-01",
    status: "verified",
    uploadedAt: "4 March 2026",
    fileName: "Memorandum_Articles_Extract.pdf",
  },
]

export function BusinessDocumentsPage() {
  const [documents, setDocuments] = React.useState<DocumentItem[]>(DEFAULT_DOCUMENTS)

  function handleUpload(id: string, title: string) {
    toast.add({
      type: "info",
      title: "Upload Document",
      description: `Select a scanned PDF or image to replace ${title}.`,
    })
  }

  function handleDownload(fileName?: string) {
    if (!fileName) return
    toast.add({
      type: "success",
      title: "Downloading Document",
      description: `${fileName} download started.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Verification Documents</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Official compliance and business registration certificates submitted for account verification.
        </p>
      </div>

      {/* Documents List */}
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                    <span className="text-xs text-muted-foreground">{doc.authority}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">Doc No: {doc.documentNumber}</span>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase w-fit self-start">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Uploaded on {doc.uploadedAt} • <span className="font-mono">{doc.fileName}</span>
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.fileName)}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
                    <span>Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpload(doc.id, doc.title)}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
                    <span>Update</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
