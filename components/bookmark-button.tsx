"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addBookmark, removeBookmark } from "@/lib/sanity/mutations"
import { isArticleBookmarked } from "@/lib/sanity/queries"
import { useAuth } from "@/lib/auth"

interface BookmarkButtonProps {
  articleId: string
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, ensureUser } = useAuth()

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      // Always ensure we have a user (either logged in or temporary)
      const currentUser = ensureUser()

      try {
        const id = await isArticleBookmarked(currentUser.id, articleId)
        setIsBookmarked(!!id)
        setBookmarkId(id)
      } catch (error) {
        console.error("Error checking bookmark status:", error)
      }
    }

    checkBookmarkStatus()
  }, [user, articleId, ensureUser])

  const handleToggleBookmark = async () => {
    // Always ensure we have a user (either logged in or temporary)
    const currentUser = ensureUser()

    setIsLoading(true)

    try {
      if (isBookmarked && bookmarkId) {
        await removeBookmark(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
        toast({
          title: "Bookmark removed",
          description: "This article has been removed from your bookmarks.",
        })
      } else {
        const result = await addBookmark({
          userId: currentUser.id,
          articleId,
        })
        setIsBookmarked(true)
        setBookmarkId(result._id)
        toast({
          title: "Bookmark added",
          description: "This article has been added to your bookmarks.",
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "There was an error updating your bookmark. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleToggleBookmark}
      disabled={isLoading}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          <span>Bookmarked</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Bookmark</span>
        </>
      )}
    </Button>
  )
}
