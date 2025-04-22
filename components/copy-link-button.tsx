"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("flex h-8 w-8 items-center justify-center rounded-full p-0", copied && "text-green-500")}
      onClick={copyToClipboard}
      title="Copy link to this article"
    >
      {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
      <span className="sr-only">{copied ? "Copied" : "Copy link to this article"}</span>
    </Button>
  )
}
