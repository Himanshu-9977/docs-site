"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { submitFeedback } from "@/lib/sanity/mutations"
import { useAuth } from "@/lib/auth"

interface ArticleFeedbackProps {
  articleId: string
}

export function ArticleFeedback({ articleId }: ArticleFeedbackProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { ensureUser } = useAuth()

  const handleFeedback = async (type: "positive" | "negative") => {
    setFeedback(type)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Ensure we have a user ID (either logged in or temporary)
    const currentUser = ensureUser()

    try {
      await submitFeedback({
        articleId,
        type: feedback,
        comment,
        userId: currentUser.id, // Add user ID to track who submitted the feedback
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 rounded-lg border p-6 text-center">
        <h3 className="text-lg font-medium">Thank you for your feedback!</h3>
        <p className="mt-2 text-muted-foreground">Your feedback helps us improve our documentation.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-lg border p-6">
      <h3 className="text-lg font-medium">Was this article helpful?</h3>
      <div className="mt-4 flex items-center space-x-4">
        <Button
          variant={feedback === "positive" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFeedback("positive")}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Yes
        </Button>
        <Button
          variant={feedback === "negative" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFeedback("negative")}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          No
        </Button>
      </div>
      {feedback && (
        <div className="mt-4 space-y-4">
          <Textarea
            placeholder="Do you have any additional feedback?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      )}
    </div>
  )
}
