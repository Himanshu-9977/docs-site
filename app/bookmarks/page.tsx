"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { getUserBookmarks } from "@/lib/sanity/queries"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function BookmarksPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const userBookmarks = await getUserBookmarks(user.id)
        setBookmarks(userBookmarks)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [user])

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Bookmarks</h1>
          <p className="text-muted-foreground">Please sign in to view your bookmarks.</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Bookmarks</h1>
          <p className="text-muted-foreground">Articles you've saved for later.</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No bookmarks yet</h3>
            <p className="text-muted-foreground mt-1">
              Start exploring our documentation and bookmark articles you find useful.
            </p>
            <Button asChild className="mt-4">
              <Link href="/docs">Browse Documentation</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark._id}>
                <CardHeader>
                  <CardTitle>{bookmark.article.title}</CardTitle>
                  <CardDescription>{bookmark.article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <span>{bookmark.article.category.title}</span>
                    <span>•</span>
                    <span>Bookmarked on {formatDate(bookmark.createdAt)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/docs/${bookmark.article.category.slug.current}/${bookmark.article.slug.current}`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    Read Article
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
