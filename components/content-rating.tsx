"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitRating } from "@/lib/sanity/mutations"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

interface ContentRatingProps {
  articleId: string
  initialRating?: number
  totalRatings?: number
}

export function ContentRating({ articleId, initialRating = 0, totalRatings = 0 }: ContentRatingProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [hasRated, setHasRated] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { toast } = useToast()
  const { ensureUser } = useAuth()

  const handleRating = async (value: number) => {
    if (hasRated || isSubmitting) return

    // Ensure we have a user ID (either logged in or temporary)
    const currentUser = ensureUser()

    setIsSubmitting(true)
    try {
      await submitRating({
        articleId,
        rating: value,
        userId: currentUser.id, // Add user ID to track who submitted the rating
      })
      setRating(value)
      setHasRated(true)
      toast({
        title: "Thank you for your rating!",
        description: "Your feedback helps us improve our documentation.",
      })
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error submitting rating",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Rate this article</p>
        {initialRating > 0 && (
          <p className="text-xs text-muted-foreground">
            {initialRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
          </p>
        )}
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={cn("p-1 focus:outline-none transition-colors", hasRated && "pointer-events-none")}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(value)}
            disabled={hasRated || isSubmitting}
            aria-label={`Rate ${value} out of 5 stars`}
          >
            <Star
              className={cn(
                "h-5 w-5",
                (hoveredRating >= value || rating >= value) && "fill-yellow-400 text-yellow-400",
                !(hoveredRating >= value || rating >= value) && "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
      {hasRated && <p className="text-xs text-muted-foreground">Thank you for your feedback!</p>}
    </div>
  )
}
