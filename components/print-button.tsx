"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/portable-text-components"
import { formatDate } from "@/lib/utils"

interface PrintButtonProps {
  article: any
}

export function PrintButton({ article }: PrintButtonProps) {
  const [open, setOpen] = useState(false)

  const handlePrint = () => {
    setOpen(false)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
        </DialogHeader>
        <div className="print-preview p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-muted-foreground">{article.summary}</p>
            <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
              <span>Version {article.version}</span>
              <span>•</span>
              <span>Updated {formatDate(article.updatedAt)}</span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <PortableText value={article.content} components={portableTextComponents} />
            </div>
            {article.authors && article.authors.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium">Written by</h3>
                <div className="mt-2">
                  {article.authors.map((author) => (
                    <span key={author._id} className="mr-2">
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handlePrint}>Print</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
