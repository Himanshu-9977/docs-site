import { NextResponse } from "next/server"
import { searchArticles } from "@/lib/sanity/queries"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchArticles(query)
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}
