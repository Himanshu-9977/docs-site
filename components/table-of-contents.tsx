"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface TableOfContentsProps {
  content: any[]
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const router = useRouter()
  const [activeId, setActiveId] = useState("")

  // Extract headings from content
  const headings = content
    .filter((block) => block._type === "block" && ["h2", "h3"].includes(block.style))
    .map((heading) => {
      // Create an ID from the heading text
      const text = heading.children
        .filter((child) => child._type === "span")
        .map((span) => span.text)
        .join("")

      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      return {
        id,
        text,
        level: heading.style === "h2" ? 2 : 3,
      }
    })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "inline-block transition-colors hover:text-foreground",
                activeId === heading.id ? "font-medium text-foreground" : "text-muted-foreground",
                heading.level === 3 && "ml-4",
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                })
                // Update the URL hash without a page reload
                window.history.pushState(null, "", `#${heading.id}`)
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
