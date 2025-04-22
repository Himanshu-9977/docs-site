"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Category not found</h1>
        <p className="text-muted-foreground">The category you're looking for doesn't exist or has been moved.</p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/docs">Go back to documentation</Link>
        </Button>
      </div>
    </div>
  )
}
