import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404 - Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <div>
        <Button asChild>
          <Link href="/docs">Go back to documentation</Link>
        </Button>
      </div>
    </div>
  )
}
