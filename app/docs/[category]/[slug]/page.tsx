import { getArticleBySlug, getCategoryBySlug, getArticlesByCategory, getArticleRating } from "@/lib/sanity/queries"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { TableOfContents } from "@/components/table-of-contents"
import { ArticleFeedback } from "@/components/article-feedback"
import { RelatedArticles } from "@/components/related-articles"
import { ArticleAuthors } from "@/components/article-authors"
import { CopyLinkButton } from "@/components/copy-link-button"
import { portableTextComponents } from "@/components/portable-text-components"
import { LastUpdated } from "@/components/last-updated"
import { ReadingProgress } from "@/components/reading-progress"
import { KeyboardNavigation } from "@/components/keyboard-navigation"
import { ContentRating } from "@/components/content-rating"
import { PrintButton } from "@/components/print-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ArticlePageProps {
  params: {
    category: string
    slug: string
  }
}

async function getPrevNextArticles(categoryId: string, currentArticleId: string) {
  const articles = await getArticlesByCategory(categoryId)
  const currentIndex = articles.findIndex((article: { _id: string }) => article._id === currentArticleId)

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null

  return { prevArticle, nextArticle }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // In Next.js 15, we need to await the params object before accessing its properties
  const { slug, category: categorySlug } = await Promise.resolve(params);

  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const { prevArticle, nextArticle } = await getPrevNextArticles(category._id, article._id)
  const { averageRating, totalRatings } = await getArticleRating(article._id)

  return (
    <div className="relative px-4 md:px-6">
      <ReadingProgress />
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
          {
            title: article.title,
            href: `/docs/${category.slug.current}/${article.slug.current}`,
          },
        ]}
      />
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{article.title}</h1>
          <p className="text-lg text-muted-foreground">{article.summary}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <BookmarkButton articleId={article._id} />
          <PrintButton article={article} />
          <CopyLinkButton />
        </div>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-10 mt-8">
        <div className="lg:flex-1 prose dark:prose-invert max-w-none">
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground mb-8">
            <span>Version {article.version}</span>
            <span>•</span>
            <LastUpdated date={article.updatedAt} />
          </div>
          <PortableText value={article.content} components={portableTextComponents} />
          <div className="mt-8 space-y-6">
            <ContentRating articleId={article._id} initialRating={averageRating} totalRatings={totalRatings} />
            <ArticleFeedback articleId={article._id} />
            <ArticleAuthors authors={article.authors} />
          </div>
          <div className="mt-8 flex justify-between">
            {prevArticle ? (
              <Button variant="outline" asChild>
                <Link href={`/docs/${category.slug.current}/${prevArticle.slug.current}`}>← {prevArticle.title}</Link>
              </Button>
            ) : (
              <div />
            )}
            {nextArticle && (
              <Button variant="outline" asChild>
                <Link href={`/docs/${category.slug.current}/${nextArticle.slug.current}`}>{nextArticle.title} →</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="hidden lg:block space-y-6">
          <TableOfContents content={article.content} />
          <RelatedArticles articles={article.relatedArticles} />
        </div>
      </div>
      <KeyboardNavigation
        prevLink={prevArticle ? `/docs/${category.slug.current}/${prevArticle.slug.current}` : undefined}
        nextLink={nextArticle ? `/docs/${category.slug.current}/${nextArticle.slug.current}` : undefined}
      />
    </div>
  )
}
