import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbsProps {
  segments: {
    title: string
    href: string
  }[]
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  return (
    <nav className="mb-6 flex items-center space-x-1 text-sm text-muted-foreground">
      {segments.map((segment, index) => (
        <React.Fragment key={segment.href}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === segments.length - 1 ? (
            <span className="font-medium text-foreground">{segment.title}</span>
          ) : (
            <Link href={segment.href} className="transition-colors hover:text-foreground">
              {segment.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
