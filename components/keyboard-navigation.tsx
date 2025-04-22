"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface KeyboardNavigationProps {
  prevLink?: string
  nextLink?: string
}

export function KeyboardNavigation({ prevLink, nextLink }: KeyboardNavigationProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left arrow key for previous article
      if (e.key === "ArrowLeft" && prevLink && !isInputElement(e.target as HTMLElement)) {
        router.push(prevLink)
      }

      // Right arrow key for next article
      if (e.key === "ArrowRight" && nextLink && !isInputElement(e.target as HTMLElement)) {
        router.push(nextLink)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prevLink, nextLink, router])

  // Helper function to check if the target is an input element
  const isInputElement = (target: HTMLElement) => {
    const tagName = target.tagName.toLowerCase()
    return tagName === "input" || tagName === "textarea" || target.isContentEditable
  }

  // This component doesn't render anything visible
  return null
}
