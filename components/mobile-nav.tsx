"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { getCategories, getArticlesByCategory } from "@/lib/sanity/queries"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [categories, setCategories] = React.useState([])
  const [articlesByCategory, setArticlesByCategory] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      const articlesData = {}
      for (const category of categoriesData) {
        articlesData[category._id] = await getArticlesByCategory(category._id)
      }
      setArticlesByCategory(articlesData)
    }

    fetchData()
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/docs"
              className={cn("flex items-center text-lg font-medium", pathname === "/docs" && "text-primary")}
              onClick={() => setOpen(false)}
            >
              Overview
            </Link>
            {categories.map((category) => (
              <div key={category._id} className="space-y-3">
                <Link
                  href={`/docs/${category.slug.current}`}
                  className={cn(
                    "flex items-center text-lg font-medium",
                    pathname === `/docs/${category.slug.current}` && "text-primary",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {category.title}
                </Link>
                {articlesByCategory[category._id]?.map((article) => (
                  <Link
                    key={article._id}
                    href={`/docs/${category.slug.current}/${article.slug.current}`}
                    className={cn(
                      "ml-4 flex items-center text-sm",
                      pathname === `/docs/${category.slug.current}/${article.slug.current}` && "text-primary",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
