import { getCategoryBySlug, getArticlesByCategory } from "@/lib/sanity/queries"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(category._id)

  return (
    <div className="space-y-6 px-4 md:px-6">
      <Breadcrumbs
        segments={[
          {
            title: "Docs",
            href: "/docs",
          },
          {
            title: category.title,
            href: `/docs/${category.slug.current}`,
          },
        ]}
      />
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{category.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Card key={article._id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                <span>Version {article.version}</span>
                <span>•</span>
                <span>{formatDate(article.updatedAt)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/docs/${category.slug.current}/${article.slug.current}`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Read Article
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
