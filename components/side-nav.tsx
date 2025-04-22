"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { getCategories, getArticlesByCategory } from "@/lib/sanity/queries"

export function SideNav() {
  const pathname = usePathname()
  const [categories, setCategories] = useState([])
  const [articlesByCategory, setArticlesByCategory] = useState({})
  const [openCategories, setOpenCategories] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      const articlesData = {}
      for (const category of categoriesData) {
        articlesData[category._id] = await getArticlesByCategory(category._id)
      }
      setArticlesByCategory(articlesData)

      // Auto-expand the current category
      const currentCategory = categoriesData.find((category) => pathname.includes(`/docs/${category.slug.current}`))

      if (currentCategory) {
        setOpenCategories((prev) => ({
          ...prev,
          [currentCategory._id]: true,
        }))
      }
    }

    fetchData()
  }, [pathname])

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <ScrollArea className="h-full py-6 pr-6">
      <div className="space-y-1">
        <h2 className="mb-4 px-2 text-xl font-semibold tracking-tight">Documentation</h2>
        <Button asChild variant={pathname === "/docs" ? "secondary" : "ghost"} className="w-full justify-start">
          <Link href="/docs">Overview</Link>
        </Button>

        {categories.map((category) => (
          <Collapsible
            key={category._id}
            open={openCategories[category._id]}
            onOpenChange={() => toggleCategory(category._id)}
            className="space-y-1"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-between", pathname === `/docs/${category.slug.current}` && "bg-accent")}
              >
                <span>{category.title}</span>
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", openCategories[category._id] && "rotate-180")}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {articlesByCategory[category._id]?.map((article) => (
                <Button
                  key={article._id}
                  asChild
                  variant="ghost"
                  className={cn(
                    "ml-4 w-[calc(100%-1rem)] justify-start",
                    pathname === `/docs/${category.slug.current}/${article.slug.current}` && "bg-accent",
                  )}
                >
                  <Link href={`/docs/${category.slug.current}/${article.slug.current}`}>{article.title}</Link>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  )
}
