import { formatDate } from "@/lib/utils"

interface LastUpdatedProps {
  date: string
}

export function LastUpdated({ date }: LastUpdatedProps) {
  if (!date) return null

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <span>Last updated on {formatDate(date)}</span>
    </div>
  )
}
