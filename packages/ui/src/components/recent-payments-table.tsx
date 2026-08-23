"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  ArrowRight01Icon,
  HelpCircleIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { toast } from "@workspace/ui/components/toast"

interface Payment {
  id: string
  reference: string
  fullReference: string
  type: string
  customer: string
  phone: string
  amount: string
  status: "UNPAID" | "FAILED" | "COMPLETED"
  date: string
}

const initialPayments: Payment[] = [
  {
    id: "1",
    reference: "SN178711...",
    fullReference: "SN17871192837482",
    type: "MOBILE",
    customer: "Customer User",
    phone: "+255712240240",
    amount: "TSh 2,999",
    status: "UNPAID",
    date: "19 Aug 2026, 07:51",
  },
  {
    id: "2",
    reference: "SN178559...",
    fullReference: "SN17855910293847",
    type: "MOBILE",
    customer: "Isack Guest",
    phone: "+255788896493",
    amount: "TSh 1,000",
    status: "UNPAID",
    date: "1 Aug 2026, 16:45",
  },
  {
    id: "3",
    reference: "SN178559...",
    fullReference: "SN17855998765432",
    type: "MOBILE",
    customer: "Isack Guest",
    phone: "+255702582488",
    amount: "TSh 1,000",
    status: "FAILED",
    date: "1 Aug 2026, 16:45",
  },
  {
    id: "4",
    reference: "SN178550...",
    fullReference: "SN17855011223344",
    type: "MOBILE",
    customer: "John paul Guest",
    phone: "+255613978254",
    amount: "TSh 1,000",
    status: "COMPLETED",
    date: "31 Jul 2026, 17:30",
  },
]

export function RecentPaymentsTable() {
  const [selected, setSelected] = React.useState<string[]>([])

  const allSelected = selected.length === initialPayments.length
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(initialPayments.map((p) => p.id))
    }
  }

  function toggleOne(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  function copyReference(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({
      type: "success",
      title: "Copied Reference",
      description: `${ref} copied to clipboard.`,
    })
  }

  return (
    <div className="relative space-y-4 px-4 pb-20 pt-2 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Recent Payments</h2>
        <Button
          size="sm"
          onClick={() =>
            toast.add({
              type: "info",
              title: "Payments",
              description: "Navigating to full payments history...",
            })
          }
          className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium text-xs px-3 rounded-lg"
        >
          <span>View all</span>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl bg-muted/20">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b bg-muted/40 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3">REFERENCE</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PHONE</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">DATE</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y text-xs">
            {initialPayments.map((payment) => {
              const isSelected = selected.includes(payment.id)
              return (
                <tr
                  key={payment.id}
                  className={`group transition-colors hover:bg-muted/40 ${
                    isSelected ? "bg-muted/50" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(payment.id)}
                      aria-label={`Select ${payment.reference}`}
                    />
                  </td>

                  {/* Reference */}
                  <td className="px-4 py-3.5 font-mono text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>{payment.reference}</span>
                      <button
                        type="button"
                        onClick={() => copyReference(payment.fullReference)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer"
                        title="Copy full reference"
                      >
                        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                      </button>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="text-[0.625rem] font-medium tracking-wider text-muted-foreground">
                      {payment.type}
                    </Badge>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3.5 text-foreground font-medium">
                    {payment.customer}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3.5 text-muted-foreground font-mono">
                    {payment.phone}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 font-semibold text-foreground">
                    {payment.amount}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    {payment.status === "COMPLETED" && (
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        COMPLETED
                      </span>
                    )}
                    {payment.status === "FAILED" && (
                      <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        FAILED
                      </span>
                    )}
                    {payment.status === "UNPAID" && (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-muted-foreground border">
                        UNPAID
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {payment.date}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Help Widget in bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() =>
            toast.add({
              type: "info",
              title: "Customer Support",
              description: "Live chat assistant is ready. How can we help you today?",
            })
          }
          className="group flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95 cursor-pointer dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} className="size-3.5" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-semibold">Need Help?</div>
            <div className="text-[0.625rem] text-emerald-100">Ask me</div>
          </div>
        </button>
      </div>
    </div>
  )
}
